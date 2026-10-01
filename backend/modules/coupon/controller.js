const Coupon = require('./model');
const Shop = require('../shop/model');
const { findShopRecord } = require('../../utils/shopHelper');
const { getGraphQLClient } = require('../../utils/common');
const { successResponse, errorResponse, logActivity } = require('../../utils/helper');
const { SEQUELIZE_OP } = require('../../config/constants');

const SHOPIFY_DISCOUNT_QUERY = `
  query getShopifyDiscounts($query: String, $first: Int!) {
    codeDiscountNodes(first: $first, query: $query) {
      nodes {
        id
        codeDiscount {
          __typename
          ... on DiscountCodeBasic {
            title
            status
            startsAt
            endsAt
            codes(first: 10) {
              nodes {
                code
              }
            }
            customerGets {
              value {
                ... on DiscountPercentage {
                  percentage
                }
                ... on DiscountAmount {
                  amount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          ... on DiscountCodeBxgy {
            title
            status
            startsAt
            endsAt
            codes(first: 10) {
              nodes {
                code
              }
            }
          }
          ... on DiscountCodeFreeShipping {
            title
            status
            startsAt
            endsAt
            codes(first: 10) {
              nodes {
                code
              }
            }
          }
        }
      }
    }
  }
`;

const parseShopifyDiscount = (node) => {
  if (!node || !node.codeDiscount) return null;
  const cd = node.codeDiscount;
  const codes = (cd.codes?.nodes || []).map((c) => c.code);
  const primaryCode = codes[0] || '';

  let discountType = 'PERCENTAGE';
  let discountValue = 0;
  let summary = '';

  if (cd.__typename === 'DiscountCodeBasic') {
    const valObj = cd.customerGets?.value;
    if (valObj?.percentage !== undefined) {
      discountType = 'PERCENTAGE';
      discountValue = Number((valObj.percentage * 100).toFixed(2));
      summary = `${discountValue}% OFF`;
    } else if (valObj?.amount) {
      discountType = 'FIXED_AMOUNT';
      discountValue = Number(valObj.amount.amount || 0);
      summary = `${valObj.amount.currencyCode || '₹'} ${discountValue} OFF`;
    }
  } else if (cd.__typename === 'DiscountCodeFreeShipping') {
    discountType = 'FREE_SHIPPING';
    discountValue = 0;
    summary = 'Free Shipping';
  } else if (cd.__typename === 'DiscountCodeBxgy') {
    discountType = 'BXGY';
    discountValue = 0;
    summary = 'Buy X Get Y';
  }

  return {
    shopifyDiscountId: node.id,
    code: primaryCode,
    allCodes: codes,
    title: cd.title || primaryCode,
    status: cd.status ? String(cd.status).toUpperCase() : 'ACTIVE',
    startsAt: cd.startsAt ? new Date(cd.startsAt) : null,
    endsAt: cd.endsAt ? new Date(cd.endsAt) : null,
    discountType,
    discountValue,
    summary: summary || `${primaryCode} offer`,
    rawPayload: node,
  };
};

const autoSyncExpiredCoupons = async (shopId) => {
  try {
    const now = new Date();
    await Coupon.update(
      { status: 'EXPIRED' },
      {
        where: {
          ...(shopId ? { shopId } : {}),
          endsAt: { [SEQUELIZE_OP.ne]: null, [SEQUELIZE_OP.lt]: now },
          status: 'ACTIVE',
        },
      }
    );
  } catch (err) {
    console.warn('[Coupon] autoSyncExpiredCoupons warning:', err.message);
  }
};

/**
 * Get all coupons for a merchant
 */
exports.getCoupons = async (req, res) => {
  try {
    const { shopId, shopDomain, search, filter } = req.query;

    let targetShop = null;
    if (shopId || shopDomain) {
      targetShop = await findShopRecord(shopId, shopDomain);
    }

    const whereClause = {};
    if (targetShop) {
      whereClause.shopId = targetShop.id;
    } else if (shopId && shopId !== 'ALL') {
      whereClause.shopId = shopId;
    }

    await autoSyncExpiredCoupons(whereClause.shopId);

    // Filter logic
    if (filter === 'TURNED_ON') {
      whereClause.isSelectable = true;
    } else if (filter === 'TURNED_OFF') {
      whereClause.isSelectable = false;
    } else if (filter === 'NEEDS_ATTENTION') {
      whereClause.status = { [SEQUELIZE_OP.ne]: 'ACTIVE' };
    }

    // Search logic
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      whereClause[SEQUELIZE_OP.or] = [
        { code: { [SEQUELIZE_OP.iLike]: term } },
        { title: { [SEQUELIZE_OP.iLike]: term } },
      ];
    }

    const coupons = await Coupon.findAll({
      where: whereClause,
      order: [
        ['isSelectable', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });

    // Calculate counts
    const baseWhere = targetShop ? { shopId: targetShop.id } : {};
    const totalCount = await Coupon.count({ where: baseWhere });
    const shownToShoppers = await Coupon.count({
      where: {
        ...baseWhere,
        isSelectable: true,
        status: 'ACTIVE',
      },
    });

    return successResponse(res, 200, 'Coupons fetched successfully', {
      coupons,
      total: totalCount,
      shownToShoppers,
      isShopifyConnected: Boolean(targetShop?.token),
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return errorResponse(res, 500, 'Failed to fetch coupons', error);
  }
};

/**
 * Validate coupon code against Shopify Admin API and add it
 */
exports.validateAndAddCoupon = async (req, res) => {
  try {
    const { shopId, shopDomain, code } = req.body;

    if (!code || !code.trim()) {
      return errorResponse(res, 400, 'Coupon code is required.');
    }

    const cleanCode = code.trim().toUpperCase();
    const targetShop = await findShopRecord(shopId, shopDomain);

    if (!targetShop) {
      return errorResponse(res, 404, 'Store record not found.');
    }

    // Check if store is connected to Shopify or if in Demo mode
    const isConnected = Boolean(targetShop.token && targetShop.myshopifyDomain);
    const isDemoMode = Boolean(req.body.isDemoMode);

    if (!isConnected && !isDemoMode) {
      return errorResponse(
        res,
        400,
        'Shopify is not connected. Connect Shopify or try Demo mode to validate and add coupons.'
      );
    }

    let couponData = null;

    // Check Shopify API if token is present
    if (isConnected) {
      try {
        const { graphqlClient } = await getGraphQLClient({
          shopDomain: targetShop.myshopifyDomain,
          accessToken: targetShop.token,
        });

        if (graphqlClient) {
          const gqlRes = await graphqlClient.request(SHOPIFY_DISCOUNT_QUERY, {
            variables: {
              query: `code:${cleanCode}`,
              first: 5,
            },
          });

          const nodes = gqlRes.data?.codeDiscountNodes?.nodes || [];
          for (const node of nodes) {
            const parsed = parseShopifyDiscount(node);
            if (parsed && parsed.allCodes.some((c) => c.toUpperCase() === cleanCode)) {
              couponData = parsed;
              break;
            }
          }
        }
      } catch (gqlErr) {
        console.warn(`[Coupon] Shopify GraphQL validation failed for ${cleanCode}:`, gqlErr.message);
      }
    }

    // If Shopify is connected but code wasn't found in Shopify
    if (isConnected && !couponData) {
      return errorResponse(
        res,
        400,
        `Coupon code "${cleanCode}" is not found or inactive in your Shopify store. Please check your Shopify Discounts.`
      );
    }

    // Fallback if in demo mode
    if (!couponData) {
      const isPercent = cleanCode.includes('%') || cleanCode === 'WELCOME10';
      couponData = {
        code: cleanCode,
        title: `${cleanCode} Offer`,
        source: 'Added by code',
        status: 'ACTIVE',
        discountType: isPercent ? 'PERCENTAGE' : 'FIXED_AMOUNT',
        discountValue: isPercent ? 10.00 : 200.00,
        summary: isPercent ? '10% off' : '₹200 off',
        startsAt: new Date(),
        endsAt: null,
      };
    }

    // Upsert into DB with isSelectable = true ("Valid codes are added and turned on.")
    const [couponRecord, created] = await Coupon.findOrCreate({
      where: {
        shopId: targetShop.id,
        code: cleanCode,
      },
      defaults: {
        shopId: targetShop.id,
        myshopifyDomain: targetShop.myshopifyDomain,
        shopifyDiscountId: couponData.shopifyDiscountId || null,
        code: cleanCode,
        source: 'Added by code',
        title: couponData.title,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        isSelectable: true,
        status: couponData.status || 'ACTIVE',
        startsAt: couponData.startsAt,
        endsAt: couponData.endsAt,
        summary: couponData.summary,
        rawPayload: couponData.rawPayload || null,
      },
    });

    if (!created) {
      await couponRecord.update({
        isSelectable: true,
        source: 'Added by code',
        status: couponData.status || 'ACTIVE',
        title: couponData.title || couponRecord.title,
        discountType: couponData.discountType || couponRecord.discountType,
        discountValue: couponData.discountValue || couponRecord.discountValue,
        summary: couponData.summary || couponRecord.summary,
      });
    }

    logActivity('COUPON_VALIDATED_AND_ADDED', {
      req,
      shopDomain: targetShop.myshopifyDomain,
      metadata: { code: cleanCode, couponId: couponRecord.id },
    });

    return successResponse(res, 200, `Coupon "${cleanCode}" validated and turned on successfully!`, {
      coupon: couponRecord,
    });
  } catch (error) {
    console.error('Error validating and adding coupon:', error);
    return errorResponse(res, 500, 'Failed to validate coupon code.', error);
  }
};

/**
 * Toggle whether a coupon is selectable by shoppers
 */
exports.toggleCouponSelectable = async (req, res) => {
  try {
    const { id } = req.params;
    const { isSelectable } = req.body;

    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return errorResponse(res, 404, 'Coupon not found.');
    }

    await coupon.update({ isSelectable: Boolean(isSelectable) });

    return successResponse(res, 200, `Coupon "${coupon.code}" is now ${isSelectable ? 'turned on' : 'turned off'}`, {
      coupon,
    });
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    return errorResponse(res, 500, 'Failed to update coupon status.', error);
  }
};

/**
 * Sync coupons from Shopify Admin GraphQL API
 */
exports.syncFromShopify = async (req, res) => {
  try {
    const { shopId, shopDomain } = req.body;
    const targetShop = await findShopRecord(shopId, shopDomain);

    if (!targetShop) {
      return errorResponse(res, 404, 'Shop record not found.');
    }

    if (!targetShop.token) {
      return errorResponse(
        res,
        400,
        'Shopify is not connected for this store. Please connect Shopify or use demo coupons.'
      );
    }

    const { graphqlClient } = await getGraphQLClient({
      shopDomain: targetShop.myshopifyDomain,
      accessToken: targetShop.token,
    });

    if (!graphqlClient) {
      return errorResponse(res, 500, 'Unable to create Shopify GraphQL client.');
    }

    const gqlRes = await graphqlClient.request(SHOPIFY_DISCOUNT_QUERY, {
      variables: { first: 50 },
    });

    const nodes = gqlRes.data?.codeDiscountNodes?.nodes || [];
    let syncedCount = 0;

    for (const node of nodes) {
      const parsed = parseShopifyDiscount(node);
      if (!parsed || !parsed.code) continue;

      const [existing, created] = await Coupon.findOrCreate({
        where: {
          shopId: targetShop.id,
          code: parsed.code.toUpperCase(),
        },
        defaults: {
          shopId: targetShop.id,
          myshopifyDomain: targetShop.myshopifyDomain,
          shopifyDiscountId: parsed.shopifyDiscountId,
          code: parsed.code.toUpperCase(),
          source: 'Synced from Shopify',
          title: parsed.title,
          discountType: parsed.discountType,
          discountValue: parsed.discountValue,
          isSelectable: false, // New coupons start off
          status: parsed.status,
          startsAt: parsed.startsAt,
          endsAt: parsed.endsAt,
          summary: parsed.summary,
          rawPayload: parsed.rawPayload,
        },
      });

      if (!created) {
        await existing.update({
          shopifyDiscountId: parsed.shopifyDiscountId,
          title: parsed.title,
          discountType: parsed.discountType,
          discountValue: parsed.discountValue,
          status: parsed.status,
          startsAt: parsed.startsAt,
          endsAt: parsed.endsAt,
          summary: parsed.summary,
          rawPayload: parsed.rawPayload,
        });
      }
      syncedCount++;
    }

    const total = await Coupon.count({ where: { shopId: targetShop.id } });
    const shownToShoppers = await Coupon.count({
      where: { shopId: targetShop.id, isSelectable: true, status: 'ACTIVE' },
    });

    return successResponse(res, 200, `Successfully synced ${syncedCount} coupons from Shopify`, {
      syncedCount,
      total,
      shownToShoppers,
    });
  } catch (error) {
    console.error('Error syncing coupons from Shopify:', error);
    return errorResponse(res, 500, 'Failed to sync coupons from Shopify.', error);
  }
};

/**
 * Pre-populate sample demo coupons for merchants without Shopify credentials
 */
exports.loadDemoCoupons = async (req, res) => {
  try {
    const { shopId, shopDomain } = req.body;
    const targetShop = await findShopRecord(shopId, shopDomain);
    const targetShopId = targetShop?.id || shopId || 1;
    const targetDomain = targetShop?.myshopifyDomain || shopDomain || 'demo-store.myshopify.com';

    // Exact 6 coupons from Image 1
    const sampleCoupons = [
      {
        code: 'FEST200',
        source: 'Added by code',
        title: 'Festival ₹200 Flat Discount',
        discountType: 'FIXED_AMOUNT',
        discountValue: 200.00,
        summary: '₹200 off',
        isSelectable: false,
        status: 'ACTIVE',
      },
      {
        code: 'WELCOME10',
        source: 'Added by code',
        title: 'New Customer 10% Discount',
        discountType: 'PERCENTAGE',
        discountValue: 10.00,
        summary: '10% off',
        isSelectable: true,
        status: 'ACTIVE',
      },
      {
        code: 'RAJ_YT',
        source: 'Synced from Shopify',
        title: 'YouTube Creator Offer 15%',
        discountType: 'PERCENTAGE',
        discountValue: 15.00,
        summary: '15% off',
        isSelectable: false,
        status: 'ACTIVE',
      },
      {
        code: 'ARCHIVE22',
        source: 'Synced from Shopify',
        title: 'Archive ₹50 Off',
        discountType: 'FIXED_AMOUNT',
        discountValue: 50.00,
        summary: '₹50 off',
        isSelectable: false,
        status: 'ACTIVE',
        needsRecheck: true,
      },
      {
        code: 'MONSOON',
        source: 'Synced from Shopify',
        title: 'Monsoon Seasonal 8%',
        discountType: 'PERCENTAGE',
        discountValue: 8.00,
        summary: '8% off',
        isSelectable: false,
        status: 'ACTIVE',
      },
      {
        code: 'SUMMER24',
        source: 'Synced from Shopify',
        title: 'Summer 2024 Discount',
        discountType: 'PERCENTAGE',
        discountValue: 12.00,
        summary: '12% off',
        isSelectable: false,
        status: 'ACTIVE',
      },
    ];

    for (const item of sampleCoupons) {
      const [record, created] = await Coupon.findOrCreate({
        where: {
          shopId: targetShopId,
          code: item.code,
        },
        defaults: {
          ...item,
          shopId: targetShopId,
          myshopifyDomain: targetDomain,
        },
      });

      if (!created) {
        await record.update(item);
      }
    }

    const coupons = await Coupon.findAll({
      where: { shopId: targetShopId },
      order: [['id', 'ASC']],
    });

    const shownToShoppers = coupons.filter((c) => c.isSelectable && c.status === 'ACTIVE').length;

    return successResponse(res, 200, 'Loaded demo coupons successfully!', {
      coupons,
      total: coupons.length,
      shownToShoppers,
    });
  } catch (error) {
    console.error('Error loading demo coupons:', error);
    return errorResponse(res, 500, 'Failed to load demo coupons.', error);
  }
};
