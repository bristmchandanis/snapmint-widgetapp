const { SEQUELIZE_DATA_TYPE } = require('../../config/constants');
const sequelize = require('../../config/db');
const Shop = require('../shop/model');

const WidgetCustomization = sequelize.define('widget_customization', {
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
  masterTemplateLayout: {
    type: SEQUELIZE_DATA_TYPE.ENUM('master_1', 'master_2', 'master_3', 'master_4', 'master_5'),
    allowNull: false,
    defaultValue: 'master_1',
    comment: 'Master Template layout selected from 1 to 5',
  },
  placement: {
    type: SEQUELIZE_DATA_TYPE.ENUM('PDP', 'CART', 'MINICART', 'COLLECTION', 'CARTDRAWER'),
    allowNull: false,
    defaultValue: 'PDP',
    comment: 'Primary display placement position',
  },
  placements: {
    type: SEQUELIZE_DATA_TYPE.JSON,
    allowNull: false,
    defaultValue: ['PDP'],
    comment: 'List of active placement positions (PDP, CART, MINICART, COLLECTION, CARTDRAWER)',
  },
  minAmount: {
    type: SEQUELIZE_DATA_TYPE.INTEGER,
    allowNull: true,
    defaultValue: 200,
  },
  maxAmount: {
    type: SEQUELIZE_DATA_TYPE.INTEGER,
    allowNull: true,
    defaultValue: 3000,
  },
  isCustomRange: {
    type: SEQUELIZE_DATA_TYPE.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  tenure: {
    type: SEQUELIZE_DATA_TYPE.INTEGER,
    allowNull: true,
    defaultValue: null,
    comment: 'Plan tenure in months (e.g. 3, 6, 9)',
  },
  dpPercent: {
    type: SEQUELIZE_DATA_TYPE.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'Down payment percentage/rate',
  },
  dpType: {
    type: SEQUELIZE_DATA_TYPE.STRING(20),
    allowNull: true,
    defaultValue: null,
    comment: 'Down payment type: percentage or fixed',
  },
  emiPercent: {
    type: SEQUELIZE_DATA_TYPE.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'EMI percentage/rate per installment',
  },
  isActive: {
    type: SEQUELIZE_DATA_TYPE.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Status flag indicating if the widget customization is active',
  },
}, {
  timestamps: true,
  tableName: 'widget_customizations',
});

// Widget Config Table

const WidgetCustomizationStyle = sequelize.define('widget_customization_style', {
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
  widgetCustomizationId: {
    type: SEQUELIZE_DATA_TYPE.INTEGER,
    allowNull: true,
    references: {
      model: WidgetCustomization,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  titleText: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: 'Pay Later',
  },
  logoUrl: {
    type: SEQUELIZE_DATA_TYPE.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  buttonText: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: 'Pay Now',
  },
  badgeText: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '& pay the rest in No Cost EMIs',
  },
  footerText: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: 'Select Merchant Pay Later on the payment screen',
  },
  step1Text: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: 'Pay Now',
  },
  feature1Text: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '0% Interest Installments',
  },
  feature2Text: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: '0 Extra Cost',
  },
  feature3Text: {
    type: SEQUELIZE_DATA_TYPE.STRING,
    allowNull: true,
    defaultValue: 'UPI & Cards accepted',
  },
  inlineWidgetConfig: {
    type: SEQUELIZE_DATA_TYPE.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'JSON payload storing all inline banner fields including layoutType, badges, prices, CTA, tooltips, branding',
  },
  masterPopupConfig: {
    type: SEQUELIZE_DATA_TYPE.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'JSON payload storing all master popup modal customizer fields including toggles, text overrides, dropdown selections',
  },
}, {
  timestamps: true,
  tableName: 'widget_customization_styles',
});

// Relationships
Shop.hasMany(WidgetCustomization, { foreignKey: 'shopId', as: 'widgetCustomizations' });
WidgetCustomization.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });

Shop.hasMany(WidgetCustomizationStyle, { foreignKey: 'shopId', as: 'widgetCustomizationStyles' });
WidgetCustomizationStyle.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });

WidgetCustomization.hasOne(WidgetCustomizationStyle, { foreignKey: 'widgetCustomizationId', as: 'style' });
WidgetCustomizationStyle.belongsTo(WidgetCustomization, { foreignKey: 'widgetCustomizationId', as: 'widgetCustomization' });

module.exports = {
  WidgetCustomization,
  WidgetCustomizationStyle,
};
