const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  JWT_SECRET,
  SUPERMASTER_ADMIN,
  ONBOARD_STATUS,
  WIDGET_STATUS,
  APP_STATUS,
  SEQUELIZE_OP,
} = require('../../config/constants');
const { sanitizeString, logActivity } = require('../../utils/helper');
const User = require('./model');
const Role = require('./roleModel');
const Shop = require('../shop/model');
const MerchantCredential = require('../merchantCredential/model');
const { getGraphQLClient } = require('../../utils/common');
const { syncSnapmintMetafield } = require('../../utils/snapmint');
const { findShopRecord } = require('../../utils/shopHelper');
const {
  WEB_PIXEL_CREATE_MUTATION,
  WEB_PIXEL_DELETE_MUTATION,
  APP_ACCESS_SCOPES_QUERY,
} = require('../shop/graphqlQuery');
const { isSuperAdminRole } = require('../../middleware/permission');

const getPermissionsForRole = async (roleName) => {
  if (!roleName || isSuperAdminRole(roleName)) return {};
  try {
    const dbRole = await Role.findOne({
      where: SEQUELIZE_OP ? { name: { [SEQUELIZE_OP.iLike]: roleName } } : { name: roleName },
    });
    if (dbRole?.permissions) return dbRole.permissions;
  } catch (err) {
    console.warn('[getPermissionsForRole] Error:', err.message);
  }
  return {};
};

const buildUserResponse = async (user) => {
  const permissions = await getPermissionsForRole(user?.role);
  return {
    id: user?.id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
    permissions,
  };
};

const signToken = async (user) => {
  const permissions = await getPermissionsForRole(user.role);
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      permissions,
    },
    JWT_SECRET,
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    const cleanEmail = sanitizeString(email);
    const cleanName = String(name).trim();

    const existingUser = await User.findOne({ where: { email: cleanEmail } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const count = await User.count();
    const isFirstUser = count === 0;
    const userRole = isFirstUser ? SUPERMASTER_ADMIN : String(role || '').trim();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: userRole,
    });

    logActivity('USER_REGISTERED', { req, user: newUser });

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token: await signToken(newUser),
      user: await buildUserResponse(newUser),
    });
  } catch (error) {
    console.error('[Register] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({
      where: { email: sanitizeString(email) },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    await logActivity('USER_LOGIN', { req, user });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: await signToken(user),
      user: await buildUserResponse(user),
    });
  } catch (error) {
    console.error('[Login] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
    });
  }
};

const logout = async (req, res) => {
  try {
    if (req.user) {
      await logActivity('USER_LOGOUT', { req, user: req.user });
    }
    return res.status(200).json({
      success: true,
      message: 'Logout successful.',
    });
  } catch (error) {
    console.error('[Logout] Error:', error.message);
    return res.status(200).json({ success: true });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      user: await buildUserResponse(user),
    });
  } catch (error) {
    console.error('[GetProfile] Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    await User.update({ name }, { where: { id: userId } });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: { name },
    });
  } catch (error) {
    console.error('[UpdateProfile] Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const [users, roles] = await Promise.all([
      User.findAll({ order: [['id', 'ASC']] }),
      Role.findAll(),
    ]);

    const roleMap = new Map();
    roles.forEach((r) => roleMap.set(String(r.name).toLowerCase().replace(/[\s_]+/g, '_'), r.permissions || {}));

    const userResponses = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: roleMap.get(String(user.role || '').toLowerCase().replace(/[\s_]+/g, '_')) || {},
    }));

    return res.status(200).json({
      success: true,
      users: userResponses,
    });
  } catch (error) {
    console.error('[GetUsers] Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

const updateUserPermissions = async (req, res) => {
  try {
    const { userId, id, role } = req.body;
    const targetUserId = userId || id || req.user?.id;

    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    const userToUpdate = await User.findByPk(targetUserId);
    if (!userToUpdate) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const targetRole = role ? String(role).trim() : userToUpdate.role;

    await userToUpdate.update({
      role: targetRole,
    });

    logActivity('USER_ROLE_UPDATED', { req, targetUser: userToUpdate, role: targetRole });

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully.',
      role: targetRole,
    });
  } catch (error) {
    console.error('[UpdateUserRole] Error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Failed to update user role.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const targetUserId = req.params.id || req.body?.id || req.query?.id;

    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    if (String(req.user?.id) === String(targetUserId)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const rowsDeleted = await User.destroy({
      where: { id: targetUserId },
    });

    if (rowsDeleted === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    console.error('[DeleteUser] Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
};

const getStores = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const [{ count, rows: shops }, merchantCreds] = await Promise.all([
      Shop.findAndCountAll({
        order: [['id', 'DESC']],
        limit,
        offset,
        raw: true,
      }),
      MerchantCredential.findAll(),
    ]);

    const credMap = new Map();
    merchantCreds.forEach((c) => {
      const credObj = c.toJSON ? c.toJSON() : c;
      const clean = sanitizeString(credObj.shop);
      if (clean) credMap.set(clean, credObj);
      if (clean?.split('.')[0]) credMap.set(clean.split('.')[0], credObj);
    });

    const formattedShops = shops.map(({ token: _token, ...shop }) => {
      const domain = (shop.myshopifyDomain || '').toLowerCase();
      const cred = credMap.get(domain) || credMap.get(domain.split('.')[0]);

      if (cred) {
        shop.merchantId = cred.merchantId || cred.mid || shop.merchantId;
        shop.merchantToken = cred.token || shop.merchantToken;
        shop.onboardStatus = ONBOARD_STATUS.APPROVED;
        shop.widgetStatus = WIDGET_STATUS.ENABLED;
        shop.appStatus = APP_STATUS.ENABLED;
      }

      return shop;
    });

    const totalCount = parseInt(count || 0, 10);
    return res.status(200).json({
      success: true,
      shops: formattedShops,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('[GetStores] Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch stores.' });
  }
};

const updateStoreStatus = async (req, res) => {
  try {
    const { id, myshopifyDomain, onboardStatus, widgetStatus } = req.body;

    if (!id && !myshopifyDomain) {
      return res.status(400).json({
        success: false,
        message: 'Store ID or domain is required.',
      });
    }

    if (!onboardStatus && !widgetStatus) {
      return res.status(400).json({
        success: false,
        message: 'No status fields provided to update.',
      });
    }

    const shop = await findShopRecord(id, myshopifyDomain);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.',
      });
    }

    const updates = {};
    let shouldSyncMetafield = false;
    let isWidgetActive = false;

    if (onboardStatus) {
      updates.onboardStatus = onboardStatus;
      const isApproved = onboardStatus === ONBOARD_STATUS.APPROVED;
      if (isApproved) {
        updates.widgetStatus = WIDGET_STATUS.ENABLED;
        updates.appStatus = APP_STATUS.ENABLED;
        shouldSyncMetafield = true;
        isWidgetActive = true;
      }
    }

    if (widgetStatus) {
      updates.widgetStatus = widgetStatus;
      updates.appStatus = widgetStatus === WIDGET_STATUS.ENABLED ? APP_STATUS.ENABLED : APP_STATUS.DISABLED;
      shouldSyncMetafield = true;
      isWidgetActive = widgetStatus === WIDGET_STATUS.ENABLED;
    }

    await shop.update(updates);

    if (shouldSyncMetafield && shop.token && shop.merchantToken) {
      getGraphQLClient({ shopDomain: shop.myshopifyDomain, accessToken: shop.token })
        .then(({ graphqlClient }) => syncSnapmintMetafield(graphqlClient, shop.merchantToken, isWidgetActive))
        .catch((err) => console.warn('[UpdateStoreStatus] Metafield sync failed:', err.message));
    }

    const message = onboardStatus
      ? `Onboard status updated to ${onboardStatus}.${onboardStatus === ONBOARD_STATUS.APPROVED ? ' Widget automatically enabled.' : ''}`
      : `Widget status updated to ${widgetStatus}.`;

    logActivity('STORE_STATUS_UPDATED', { req, shop, message, metadata: { onboardStatus, widgetStatus } });

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('[UpdateStoreStatus] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update store status.',
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    console.error('[ChangePassword] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password.',
    });
  }
};

const updateStoreWebPixel = async (req, res) => {
  try {
    const { id, myshopifyDomain, hasWebPixel } = req.body;
    if (!id && !myshopifyDomain) {
      return res.status(400).json({ success: false, message: 'Store ID or domain is required.' });
    }

    const shopRecord = await findShopRecord(id, myshopifyDomain);
    if (!shopRecord) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    const isEnabled = Boolean(Number(hasWebPixel));
    const targetStatus = isEnabled ? '1' : '0';

    const isApproved = shopRecord.onboardStatus === '1' || shopRecord.onboard_status === '1' || String(shopRecord.onboardStatus).toUpperCase() === 'APPROVED';
    if (isEnabled && !isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Only approved stores allowed.',
      });
    }

    // Early return if state is unchanged and pixel ID matches status
    if (shopRecord.hasWebPixel === targetStatus && (isEnabled === Boolean(shopRecord.webPixelId))) {
      return res.status(200).json({
        success: true,
        message: 'Web Pixel tracking updated successfully.',
        hasWebPixel: targetStatus,
      });
    }

    let currentPixelId = shopRecord.webPixelId;

    if (shopRecord.token) {
      const { graphqlClient } = (await getGraphQLClient({
        shopDomain: shopRecord.myshopifyDomain,
        accessToken: shopRecord.token,
      })) || {};

      if (graphqlClient) {
        if (isEnabled && !currentPixelId) {
          // 1. Scope Check: Verify write_pixels scope is granted
          const scopeResponse = await graphqlClient.request(APP_ACCESS_SCOPES_QUERY).catch((scopeError) => {
            console.warn('[WebPixelScope] Scope query warning:', scopeError.message);
            return null;
          });

          const grantedScopes = scopeResponse?.data?.app?.availableAccessScopes || [];
          const hasWritePixelScope = grantedScopes.some((scopeItem) => scopeItem.handle === 'write_pixels');

          if (!hasWritePixelScope) {
            return res.status(400).json({
              success: false,
              message: "Required scope is not granted by the store yet.",
            });
          }

          // 2. Create Web Pixel on Shopify if scope exists
          const createResponse = await graphqlClient.request(WEB_PIXEL_CREATE_MUTATION, {
            variables: { webPixel: { settings: JSON.stringify({ accountID: shopRecord.merchantId }) } },
          }).catch((createError) => console.warn('[WebPixelCreate] Warning:', createError.message));

          currentPixelId = createResponse?.data?.webPixelCreate?.webPixel?.id || null;
        } else if (!isEnabled && currentPixelId) {
          // 3. Delete Web Pixel on Shopify when toggling OFF
          await graphqlClient.request(WEB_PIXEL_DELETE_MUTATION, {
            variables: { id: currentPixelId },
          }).catch((deleteError) => console.warn('[WebPixelDelete] Warning:', deleteError.message));

          currentPixelId = null;
        }
      }
    }

    await shopRecord.update({
      hasWebPixel: targetStatus,
      webPixelId: currentPixelId,
    });

    const actionType = isEnabled ? (currentPixelId ? 'CREATED' : 'ENABLED') : 'DELETED';

    logActivity('WEB_PIXEL_UPDATED', { req, shop: shopRecord, hasWebPixel: isEnabled });

    return res.status(200).json({
      success: true,
      message: 'Web Pixel tracking updated successfully.',
      hasWebPixel: targetStatus,
      action: actionType,
    });
  } catch (error) {
    console.error('[UpdateStoreWebPixel] Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update web pixel setting.' });
  }
};

const createRole = async (req, res) => {
  try {
    const { id, name, permissions } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Role name is required.' });
    }

    const cleanName = String(name).trim();

    let targetRole = null;
    if (id) {
      targetRole = await Role.findByPk(id);
    }
    if (!targetRole) {
      targetRole = await Role.findOne({ where: { name: cleanName } });
    }

    if (targetRole) {
      const previousRole = targetRole.name;
      await targetRole.update({ name: cleanName, permissions: permissions || {} });

      if (previousRole && previousRole !== cleanName) {
        await User.update({ role: cleanName }, { where: { role: previousRole } });
      }

      return res.status(200).json({
        success: true,
        message: `Role "${cleanName}" updated successfully.`,
        role: targetRole,
      });
    }

    const newRole = await Role.create({
      name: cleanName,
      permissions: permissions || {},
    });

    return res.status(201).json({
      success: true,
      message: `Role "${cleanName}" created successfully!`,
      role: newRole,
    });
  } catch (error) {
    console.error('[CreateRole] Error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Failed to create role.' });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({ order: [['id', 'DESC']] });
    const assignableRoles = roles.filter(
      (r) => String(r.name).toUpperCase().replace(/[\s_]+/g, '_') !== SUPERMASTER_ADMIN
    );

    return res.status(200).json({
      success: true,
      roles: assignableRoles,
    });
  } catch (error) {
    console.error('[GetRoles] Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch roles.' });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id, reassignRole } = req.body || {};
    if (!id || !reassignRole) {
      return res.status(400).json({ success: false, message: 'Role ID and reassignRole are required.' });
    }

    const roleToDestroy = await Role.findByPk(id);
    if (!roleToDestroy) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }

    const roleName = roleToDestroy.name;
    await roleToDestroy.destroy();

    if (roleName) {
      await User.update({ role: reassignRole }, { where: { role: roleName } });
    }

    return res.status(200).json({
      success: true,
      message: 'Role deleted successfully.',
    });
  } catch (error) {
    console.error('[DeleteRole] Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete role.' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getUsers,
  updateUserPermissions,
  deleteUser,
  getStores,
  updateStoreStatus,
  updateStoreWebPixel,
  changePassword,
  createRole,
  getRoles,
  deleteRole,
};
