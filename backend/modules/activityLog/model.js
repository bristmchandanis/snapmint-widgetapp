const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userRole: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shopDomain: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  module: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'STORES',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'DASHBOARD',
  },
}, {
  tableName: 'activity_logs',
  timestamps: true,
});

module.exports = ActivityLog;
