const Coupon = require('./model');
const { Op } = require('sequelize');
const { findShopRecord } = require('../../utils/shopHelper');
const { getGraphQLClient } = require('../../utils/common');
const { successResponse, errorResponse } = require('../../utils/helper');
const { getShopifyDiscountByCode } = require('./graphql');

exports.getCoupons = async (req, res) => {
  try {
    const targetShop = await findShopRecord(req.query.shopId, req.query.shopDomain);
    if (!targetShop) return successResponse(res, 200, 'No store found', { coupons: [] });

    const now = new Date();
    await Coupon.update(
      { status: 'EXPIRED', isSelectable: false, needsRecheck: true },
      {
        where: {
          shopId: targetShop.id,
          endsAt: { [Op.ne]: null, [Op.lte]: now },
          [Op.or]: [
            { status: { [Op.ne]: 'EXPIRED' } },
            { isSelectable: true },
            { needsRecheck: false },
          ],
        },
      }
    ).catch(() => {});

    const coupons = await Coupon.findAll({
      where: { shopId: targetShop.id },
      order: [['isSelectable', 'DESC'], ['createdAt', 'DESC']],
    });

    return successResponse(res, 200, 'Coupons fetched successfully', { coupons });
  } catch (error) {
    return errorResponse(res, 500, 'Failed to fetch coupons', error);
  }
};

exports.validateAndAddCoupon = async (req, res) => {
  try {
    const cleanCode = req.body.code?.trim()?.toUpperCase();
    if (!cleanCode) return errorResponse(res, 400, 'Coupon code is required.');

    const targetShop = await findShopRecord(req.body.shopId, req.body.shopDomain);
    if (!targetShop?.token) return errorResponse(res, 400, 'Store not connected to Shopify.');

    const { graphqlClient } = await getGraphQLClient({
      shopDomain: targetShop.myshopifyDomain,
      accessToken: targetShop.token,
    });

    const discount = await getShopifyDiscountByCode(graphqlClient, cleanCode);
    if (!discount) {
      return errorResponse(res, 400, `Coupon "${cleanCode}" does not exist in Shopify.`);
    }

    const isExpired = discount.status === 'EXPIRED' || (discount.endsAt && new Date(discount.endsAt) <= new Date());
    if (isExpired) {
      await Coupon.update(
        { ...discount, status: 'EXPIRED', isSelectable: false, needsRecheck: true },
        { where: { shopId: targetShop.id, code: cleanCode } }
      );
      return errorResponse(res, 400, `Coupon "${cleanCode}" has expired in Shopify.`);
    }

    if (discount.status !== 'ACTIVE') {
      return errorResponse(res, 400, `Coupon "${cleanCode}" is inactive in Shopify.`);
    }

    const [coupon] = await Coupon.upsert({
      ...discount,
      shopId: targetShop.id,
      myshopifyDomain: targetShop.myshopifyDomain,
      code: cleanCode,
      isSelectable: true,
      needsRecheck: false,
      source: 'Added by code',
    });

    return successResponse(res, 200, `Coupon "${cleanCode}" validated and turned on!`, { coupon });
  } catch (error) {
    return errorResponse(res, 500, 'Failed to validate coupon code.', error);
  }
};

exports.toggleCouponSelectable = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return errorResponse(res, 404, 'Coupon not found.');

    await coupon.update({ isSelectable: Boolean(req.body.isSelectable) });
    return successResponse(res, 200, `Coupon "${coupon.code}" updated successfully`, { coupon });
  } catch (error) {
    return errorResponse(res, 500, 'Failed to update coupon status.', error);
  }
};
