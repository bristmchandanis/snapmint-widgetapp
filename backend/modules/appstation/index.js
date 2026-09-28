const express = require('express');
const router = express.Router();
const {
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
} = require('./controller');
const verifyToken = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

router.get('/roles', verifyToken, getRoles);
router.post('/roles/create', verifyToken, createRole);
router.delete('/roles/delete', verifyToken, deleteRole);

router.get('/users', verifyToken, checkPermission('users', 'read'), getUsers);
router.put('/users/permissions', verifyToken, checkPermission('users', 'edit'), updateUserPermissions);
router.delete('/users/delete', verifyToken, checkPermission('users', 'edit'), deleteUser);

router.get('/stores', verifyToken, checkPermission('stores', 'read'), getStores);
router.post('/stores/status', verifyToken, checkPermission('stores', 'edit'), updateStoreStatus);
router.post('/stores/web-pixel', verifyToken, checkPermission('stores', 'edit'), updateStoreWebPixel);

module.exports = router;
