const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { encryptedAttribute } = require('../../utils/encryption');

const MerchantCredential = sequelize.define('MerchantCredential', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  shop: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  merchantId: encryptedAttribute('merchantId', {
    allowNull: false,
  }),
  token: encryptedAttribute('token', {
    allowNull: true,
  }),
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brandingMode: {
    type: DataTypes.ENUM('snapmint', 'co-branded', 'white-label'),
    allowNull: false,
    defaultValue: 'snapmint',
  },
  appInstall: {
    type: DataTypes.ENUM('0', '1'),
    allowNull: false,
    defaultValue: '0',
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'merchant_credentials',
  timestamps: true,
});

module.exports = MerchantCredential;
