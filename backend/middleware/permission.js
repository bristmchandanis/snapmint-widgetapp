const { SUPERMASTER_ADMIN, SEQUELIZE_OP } = require('../config/constants');
const Role = require('../modules/appstation/roleModel');

const isSuperAdminRole = (role) => {
  if (!role) return false;
  return String(role).trim().toUpperCase().replace(/[\s_]+/g, '_') === SUPERMASTER_ADMIN;
};

const checkAuth = (req, res) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized. Authentication required.' });
    return false;
  }
  return true;
};

const parsePermissions = (raw) => {
  if (typeof raw === 'object' && raw !== null) return raw;
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
};

const getUserRolePermissions = async (user) => {
  if (!user?.role) return parsePermissions(user?.permissions);
  try {
    const dbRole = await Role.findOne({
      where: SEQUELIZE_OP ? { name: { [SEQUELIZE_OP.iLike]: user.role } } : { name: user.role },
    });
    if (dbRole?.permissions) return parsePermissions(dbRole.permissions);
  } catch (err) {
    console.warn('[checkPermission] Role lookup notice:', err.message);
  }
  return parsePermissions(user?.permissions);
};

const checkPermission = (moduleName, action = 'read') => {
  return async (req, res, next) => {
    if (!checkAuth(req, res)) return;
    if (isSuperAdminRole(req.user.role)) return next();
    if (moduleName === 'stores' && action === 'read') return next();

    try {
      const permissions = await getUserRolePermissions(req.user);
      const modulePerms = permissions[moduleName] || {};
      const storesPerms = permissions.stores || {};

      const isAllowed = Boolean(
        modulePerms[action] ||
        (moduleName === 'widgetCustomization' && (storesPerms.write || storesPerms.edit || storesPerms.read))
      );

      if (isAllowed) return next();
    } catch (err) {
      console.warn('[checkPermission] Error:', err.message);
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Missing '${action}' permission for '${moduleName}'.`,
    });
  };
};

module.exports = {
  checkPermission,
  isSuperAdminRole,
  getUserRolePermissions,
  parsePermissions,
};
