const { SEQUELIZE_DATA_TYPE } = require('../../config/constants');
const sequelize = require('../../config/db');
const Shop = require('../shop/model');

const Widget = sequelize.define('widget', {
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
  plans: {
    type: SEQUELIZE_DATA_TYPE.JSON,
    allowNull: true,
    defaultValue: [],
  },
  priceBands: {
    type: SEQUELIZE_DATA_TYPE.JSON,
    allowNull: true,
    defaultValue: {},
  },
  configure: {
    type: SEQUELIZE_DATA_TYPE.JSON,
    allowNull: true,
    defaultValue: {},
  },
  customization: {
    type: SEQUELIZE_DATA_TYPE.JSON,
    allowNull: true,
    defaultValue: {},
  },
  targeting: {
    type: SEQUELIZE_DATA_TYPE.JSON,
    allowNull: true,
    defaultValue: {},
  },
  isActive: {
    type: SEQUELIZE_DATA_TYPE.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  timestamps: true,
  tableName: 'widgets',
});

Shop.hasMany(Widget, { foreignKey: 'shopId', as: 'widgets' });
Widget.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });

module.exports = {
  Widget,
  WidgetCustomization: Widget,
};
