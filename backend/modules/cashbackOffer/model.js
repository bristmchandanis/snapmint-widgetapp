const { SEQUELIZE_DATA_TYPE } = require('../../config/constants');
const sequelize = require('../../config/db');
const Shop = require('../shop/model');

const CashbackOffer = sequelize.define('cashback_offer', {
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
  title: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: false,
    defaultValue: 'Mega Cashback Offer',
  },
  status: {
    type: SEQUELIZE_DATA_TYPE.ENUM('ACTIVE', 'EXPIRED'),
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
  cashbackType: {
    type: SEQUELIZE_DATA_TYPE.ENUM('PERCENTAGE', 'FLAT'),
    allowNull: false,
    defaultValue: 'PERCENTAGE',
  },
  cashbackValue: {
    type: SEQUELIZE_DATA_TYPE.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 10.00,
  },
  cashbackCreditDays: {
    type: SEQUELIZE_DATA_TYPE.INTEGER,
    allowNull: false,
    defaultValue: 15,
  },
  termsAndConditions: {
    type: SEQUELIZE_DATA_TYPE.JSON,
    allowNull: true,
  },
  startDate: {
    type: SEQUELIZE_DATA_TYPE.DATE,
    allowNull: true,
  },
  endDate: {
    type: SEQUELIZE_DATA_TYPE.DATE,
    allowNull: true,
  },
}, {
  timestamps: true, // Automatically creates & updates `createdAt` and `updatedAt`
  tableName: 'cashback_offers',
});

// Relationships
Shop.hasMany(CashbackOffer, { foreignKey: 'shopId', as: 'cashbackOffers' });
CashbackOffer.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });

module.exports = CashbackOffer;
