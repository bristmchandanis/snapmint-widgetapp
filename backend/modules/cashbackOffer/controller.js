const CashbackOffer = require('./model');
const Shop = require('../shop/model');
const { findShopRecord } = require('../../utils/shopHelper');
const { logActivity } = require('../../utils/helper');
const { SEQUELIZE_OP } = require('../../config/constants');
const { syncCashbackOfferMetafieldAsync } = require('../../utils/snapmint');

const isOfferExpired = (endDate) => {
  if (!endDate) return false;
  const end = new Date(endDate);
  if (isNaN(end.getTime())) return false;
  return end.toISOString().slice(0, 10) < new Date().toISOString().slice(0, 10);
};

const autoSyncOfferStatuses = async () => {
  try {
    const now = new Date();
    await Promise.all([
      CashbackOffer.update(
        { status: 'EXPIRED' },
        {
          where: {
            endDate: { [SEQUELIZE_OP.ne]: null, [SEQUELIZE_OP.lt]: now },
            status: { [SEQUELIZE_OP.ne]: 'EXPIRED' },
          },
        }
      ),
      CashbackOffer.update(
        { status: 'ACTIVE' },
        {
          where: {
            endDate: { [SEQUELIZE_OP.ne]: null, [SEQUELIZE_OP.gte]: now },
            status: 'EXPIRED',
          },
        }
      ),
    ]);
  } catch (err) {
    console.warn('[CashbackOffer] autoSyncOfferStatuses warning:', err.message);
  }
};

exports.getOffers = async (req, res) => {
  try {
    await autoSyncOfferStatuses();
    const { shopId, status, shopDomain } = req.query;

    const whereClause = {};
    if (shopId && shopId !== 'ALL') {
      const shop = await findShopRecord(shopId, shopDomain);
      if (shop) {
        whereClause.shopId = shop.id;
      } else {
        whereClause.shopId = shopId;
      }
    }

    if (status) {
      whereClause.status = status;
    }

    const offers = await CashbackOffer.findAll({
      where: whereClause,
      attributes: { exclude: ['shopId'] },
      include: [{ model: Shop, as: 'shop', attributes: ['id', 'name', 'myshopifyDomain'] }],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      message: 'Cashback offers retrieved successfully.',
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    console.error('[CashbackOffer] getOffers error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch cashback offers.',
      error: error.message,
    });
  }
};

exports.createOffer = async (req, res) => {
  try {
    const payload = req.body || {};
    const { shopId, myshopifyDomain } = payload;

    const shop = await findShopRecord(shopId, myshopifyDomain);
    if (!shop) {
      return res.status(400).json({
        success: false,
        message: 'Valid shopId or domain is required.',
      });
    }

    const isExpired = isOfferExpired(payload.endDate);
    const initialStatus = payload.endDate ? (isExpired ? 'EXPIRED' : 'ACTIVE') : (payload.status || 'ACTIVE');

    const newOffer = await CashbackOffer.create({
      ...payload,
      shopId: shop.id,
      status: initialStatus,
    });

    await logActivity('CASHBACK_OFFER_CREATED', {
      req,
      shop,
      offerId: newOffer.id,
    });

    syncCashbackOfferMetafieldAsync(shop, CashbackOffer);

    const offerData = newOffer.toJSON();
    delete offerData.shopId;

    return res.status(201).json({
      success: true,
      message: 'Cashback offer created successfully.',
      data: offerData,
    });
  } catch (error) {
    console.error('[CashbackOffer] createOffer error:', error.message);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to create cashback offer.',
    });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};

    const offer = await CashbackOffer.findByPk(id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Cashback offer not found.',
      });
    }

    const finalEndDate = payload.endDate !== undefined ? payload.endDate : offer.endDate;
    let targetStatus = payload.status || offer.status;
    if (finalEndDate) {
      targetStatus = isOfferExpired(finalEndDate) ? 'EXPIRED' : 'ACTIVE';
    }

    const updatedOffer = await offer.update({
      ...payload,
      status: targetStatus,
    });

    const shop = await Shop.findByPk(offer.shopId);
    if (shop) syncCashbackOfferMetafieldAsync(shop, CashbackOffer);

    const offerData = updatedOffer.toJSON();
    delete offerData.shopId;

    return res.status(200).json({
      success: true,
      message: 'Cashback offer updated successfully.',
      data: offerData,
    });
  } catch (error) {
    console.error('[CashbackOffer] updateOffer error:', error.message);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to update cashback offer.',
    });
  }
};



exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await CashbackOffer.findByPk(id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Cashback offer not found.',
      });
    }

    const shopId = offer.shopId;
    await offer.destroy();

    const shop = await Shop.findByPk(shopId);
    if (shop) syncCashbackOfferMetafieldAsync(shop, CashbackOffer);

    return res.status(200).json({
      success: true,
      message: 'Cashback offer deleted successfully.',
    });
  } catch (error) {
    console.error('[CashbackOffer] deleteOffer error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete cashback offer.',
    });
  }
};
