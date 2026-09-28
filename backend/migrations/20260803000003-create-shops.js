'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shops', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      merchantId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      merchantToken: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      myshopifyDomain: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      domain: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      province: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      ianaTimezone: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      timezone: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      shopOwner: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      moneyFormat: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      moneyWithCurrencyFormat: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      weightUnit: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      planDisplayName: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      planName: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      chargeId: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      recurringCharge: {
        type: Sequelize.ENUM('0', '1', '2'),
        allowNull: false,
        defaultValue: '0',
      },
      planType: {
        type: Sequelize.ENUM('0', '1', '2', '3'),
        allowNull: false,
        defaultValue: '0',
      },
      planInterval: {
        type: Sequelize.ENUM('1', '2'),
        allowNull: false,
        defaultValue: '1',
      },
      billingOn: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      activatedOn: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      cancelledOn: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      trialEndsOn: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      isOlderStore: {
        type: Sequelize.ENUM('0', '1', '2'),
        allowNull: false,
        defaultValue: '2',
      },
      allowDevelopmentStore: {
        type: Sequelize.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '0',
      },
      appStatus: {
        type: Sequelize.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '1',
      },
      appInstall: {
        type: Sequelize.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '1',
      },
      isScopeUpdate: {
        type: Sequelize.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '1',
      },
      displaySettings: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      onboardStatus: {
        type: Sequelize.ENUM('PENDING', 'APPROVED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      widgetStatus: {
        type: Sequelize.ENUM('DISABLED', 'ENABLED'),
        allowNull: false,
        defaultValue: 'DISABLED',
      },
      allowCustomization: {
        type: Sequelize.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '1',
        comment: '0 = Disabled, 1 = Enabled',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('shops');
  },
};
