const { SEQUELIZE_DATA_TYPE } = require('../../config/constants');
const sequelize = require('../../config/db');
const Shop = require('../shop/model');

const Coupon = sequelize.define('coupon', {
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
  myshopifyDomain: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
  },
  shopifyDiscountId: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
  },
  code: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: false,
  },
  title: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
  },
  discountType: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: false,
    defaultValue: 'PERCENTAGE',
  },
  discountValue: {
    type: SEQUELIZE_DATA_TYPE.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  isSelectable: {
    type: SEQUELIZE_DATA_TYPE.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether selectable by shopper on storefront widget',
  },
  status: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
  startsAt: {
    type: SEQUELIZE_DATA_TYPE.DATE,
    allowNull: true,
  },
  endsAt: {
    type: SEQUELIZE_DATA_TYPE.DATE,
    allowNull: true,
  },
  summary: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
  },
  source: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: 'Synced from Shopify',
  },
  needsRecheck: {
    type: SEQUELIZE_DATA_TYPE.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  rawPayload: {
    type: SEQUELIZE_DATA_TYPE.JSON,
    allowNull: true,
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['shopId', 'code'],
    },
    {
      fields: ['myshopifyDomain'],
    },
  ],
});

Shop.hasMany(Coupon, { foreignKey: 'shopId', as: 'coupons' });
Coupon.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });

module.exports = Coupon;
