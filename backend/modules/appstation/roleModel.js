const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
}, {
  tableName: 'roles',
  timestamps: true,
});

module.exports = Role;
