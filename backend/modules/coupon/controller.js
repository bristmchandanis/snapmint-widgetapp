const Coupon = require('./model');
const { findShopRecord } = require('../../utils/shopHelper');
const { getGraphQLClient } = require('../../utils/common');
const { successResponse, errorResponse } = require('../../utils/helper');
const { getShopifyDiscountByCode } = require('./graphql');

exports.getCoupons = async (req, res) => {
  try {
    const targetShop = await findShopRecord(req.query.shopId, req.query.shopDomain);
    if (!targetShop) {
      return successResponse(res, 200, 'No store found', { coupons: [] });
    }

    const coupons = await Coupon.findAll({
      where: { shopId: targetShop.id },
      order: [['isSelectable', 'DESC'], ['createdAt', 'DESC']],
    });

    return successResponse(res, 200, 'Coupons fetched successfully', { coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return errorResponse(res, 500, 'Failed to fetch coupons', error);
  }
};

exports.validateAndAddCoupon = async (req, res) => {
  try {
    const { shopId, shopDomain, code } = req.body;
    const cleanCode = code?.trim()?.toUpperCase();

    if (!cleanCode) {
      return errorResponse(res, 400, 'Coupon code is required.');
    }

    const targetShop = await findShopRecord(shopId, shopDomain);
    if (!targetShop || !targetShop.token) {
      return errorResponse(res, 400, 'Store record not found or Shopify is not connected.');
    }

    const { graphqlClient } = await getGraphQLClient({
      shopDomain: targetShop.myshopifyDomain,
      accessToken: targetShop.token,
    });

    const discountData = await getShopifyDiscountByCode(graphqlClient, cleanCode);
    if (!discountData) {
      return errorResponse(res, 400, `Coupon "${cleanCode}" is not found or inactive in Shopify.`);
    }

    // Save or update coupon in DB and turn it ON
    let coupon = await Coupon.findOne({
      where: { shopId: targetShop.id, code: cleanCode },
    });

    if (coupon) {
      await coupon.update({ ...discountData, isSelectable: true });
    } else {
      coupon = await Coupon.create({
        ...discountData,
        shopId: targetShop.id,
        myshopifyDomain: targetShop.myshopifyDomain,
        code: cleanCode,
        isSelectable: true,
        source: 'Added by code',
      });
    }

    return successResponse(res, 200, `Coupon "${cleanCode}" validated and turned on!`, { coupon });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return errorResponse(res, 500, 'Failed to validate coupon code.', error);
  }
};

exports.toggleCouponSelectable = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return errorResponse(res, 404, 'Coupon not found.');
    }

    await coupon.update({ isSelectable: Boolean(req.body.isSelectable) });
    return successResponse(res, 200, `Coupon "${coupon.code}" updated successfully`, { coupon });
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    return errorResponse(res, 500, 'Failed to update coupon status.', error);
  }
};
