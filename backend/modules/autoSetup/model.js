const { SEQUELIZE_DATA_TYPE } = require('../../config/constants');
const sequelize = require('../../config/db');
const Shop = require('../shop/model');

const AutoSetup = sequelize.define('auto_setup', {
  id: {
    type: SEQUELIZE_DATA_TYPE.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  shopId: {
    type: SEQUELIZE_DATA_TYPE.INTEGER,
    allowNull: false,
    references: {
      model: Shop,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },

  // Collection Selectors
  collectionGridItem: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  collectionSalePrice: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  collectionProductId: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  collectionProductHandle: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  collectionProductName: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  collectionVariantId: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  collectionProductAvailable: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  collectionProductUrl: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  collectionWidgetAppendTarget: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  collectionWidgetPlacement: {
    type: SEQUELIZE_DATA_TYPE.ENUM('before', 'after'),
    allowNull: false,
    defaultValue: 'after',
  },

  // PDP Selectors
  pdpPriceSelector: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  pdpSalePrice: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  pdpProductId: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  pdpProductHandle: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  pdpProductName: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  pdpVariantId: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  pdpProductAvailable: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  pdpProductUrl: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  pdpWidgetAppendTarget: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  pdpWidgetPlacement: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: false,
    defaultValue: 'after',
  },
  pdpFallbackSelector: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  pdpRerenderOnVariant: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: 'on',
  },

  // Cart Selectors
  cartItem: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  cartTotal: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  cartWidgetAppendTarget: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  cartWidgetPlacement: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: false,
    defaultValue: 'after',
  },
  cartFallbackSelector: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },

  // Cart Drawer Selectors
  cartDrawerItem: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  cartDrawerTotal: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  cartDrawerWidgetAppendTarget: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  cartDrawerWidgetPlacement: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: false,
    defaultValue: 'after',
  },

  // Mini Cart Selectors
  minCartItem: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  minCartTotal: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  minCartWidgetAppendTarget: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },
  minCartWidgetPlacement: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: false,
    defaultValue: 'after',
  },
  minCartFallbackSelector: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '',
  },

  // Product / Collection Exclusions
  excludedProducts: {
    type: SEQUELIZE_DATA_TYPE.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  excludedCollections: {
    type: SEQUELIZE_DATA_TYPE.TEXT,
    allowNull: true,
    defaultValue: '',
  },
}, {
  timestamps: true,
  tableName: 'auto_setups',
});

// Relationships
Shop.hasMany(AutoSetup, { foreignKey: 'shopId', as: 'autoSetups' });
AutoSetup.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });

module.exports = AutoSetup;
