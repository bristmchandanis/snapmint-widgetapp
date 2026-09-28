const ActivityLog = require('./model');
const { Op } = require('sequelize');
const { isSuperAdminRole } = require('../../middleware/permission');

exports.getActivityLogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const offset = (page - 1) * limit;

    const { module: moduleFilter, source: sourceFilter, search, startDate, endDate, shopDomain: queryShopDomain } = req.query;

    const user = req.user || {};
    const isSuperAdmin = isSuperAdminRole(user.role);
    const targetShop = queryShopDomain || user.shopDomain;

    const whereConditions = [];

    if (!isSuperAdmin) {
      const shopCondition = targetShop ? { shopDomain: targetShop } : {};

      whereConditions.push({
        [Op.or]: [
          { userId: user.id },
          { source: 'SHOPIFY_APP', ...shopCondition },
          { module: 'SHOPIFY_APP', ...shopCondition },
        ],
      });
    } else if (targetShop) {
      whereConditions.push({ shopDomain: targetShop });
    }

    if (moduleFilter && moduleFilter !== 'ALL') {
      if (moduleFilter === 'SHOPIFY_APP') {
        whereConditions.push({ [Op.or]: [{ module: 'SHOPIFY_APP' }, { source: 'SHOPIFY_APP' }] });
      } else {
        whereConditions.push({ module: moduleFilter });
      }
    }
    if (sourceFilter && sourceFilter !== 'ALL') whereConditions.push({ source: sourceFilter });

    if (search?.trim()) {
      const query = `%${search.trim()}%`;
      whereConditions.push({
        [Op.or]: [
          { description: { [Op.iLike]: query } },
          { userName: { [Op.iLike]: query } },
          { userEmail: { [Op.iLike]: query } },
          { shopDomain: { [Op.iLike]: query } },
          { action: { [Op.iLike]: query } },
        ],
      });
    }

    if (startDate && endDate) {
      whereConditions.push({ createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] } });
    }

    const { rows: logs, count: total } = await ActivityLog.findAndCountAll({
      where: whereConditions.length ? { [Op.and]: whereConditions } : {},
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      isSuperAdmin,
    });
  } catch (error) {
    console.error('[GetActivityLogs] Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch activity logs.' });
  }
};
