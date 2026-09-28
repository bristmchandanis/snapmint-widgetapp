'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    if (!(await queryInterface.tableExists('widget_customizations'))) {
      await queryInterface.createTable('widget_customizations', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        shopId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'shops', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        masterTemplateLayout: {
          type: Sequelize.ENUM('master_1', 'master_2', 'master_3', 'master_4', 'master_5'),
          allowNull: false,
          defaultValue: 'master_1',
        },
        placement: {
          type: Sequelize.ENUM('PDP', 'CART', 'MINICART', 'COLLECTION'),
          allowNull: false,
          defaultValue: 'PDP',
        },
        placements: {
          type: Sequelize.JSON,
          allowNull: false,
          defaultValue: ['PDP', 'CART'],
        },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
      });
    }

    if (!(await queryInterface.tableExists('widget_customization_styles'))) {
      await queryInterface.createTable('widget_customization_styles', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        shopId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'shops', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        widgetCustomizationId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'widget_customizations', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        titleText: { type: Sequelize.STRING, allowNull: true, defaultValue: 'Pay Later' },
        logoUrl: { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
        buttonText: { type: Sequelize.STRING, allowNull: true, defaultValue: 'Pay Now' },
        badgeText: { type: Sequelize.STRING, allowNull: true, defaultValue: '& pay the rest in No Cost EMIs' },
        footerText: { type: Sequelize.STRING, allowNull: true, defaultValue: 'Select Merchant Pay Later on the payment screen' },
        step1Text: { type: Sequelize.STRING, allowNull: true, defaultValue: 'Pay Now' },
        feature1Text: { type: Sequelize.STRING, allowNull: true, defaultValue: '0% Interest Installments' },
        feature2Text: { type: Sequelize.STRING, allowNull: true, defaultValue: '0 Extra Cost' },
        feature3Text: { type: Sequelize.STRING, allowNull: true, defaultValue: 'UPI & Cards accepted' },
        featureTextColor: { type: Sequelize.STRING(20), allowNull: true, defaultValue: '#6b7280' },
        titleColor: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '#111827' },
        buttonBgColor: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '#000000' },
        buttonTextColor: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '#111827' },
        badgeColor: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '#4b5563' },
        backgroundColor: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '#ffffff' },
        borderColor: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '#e5e7eb' },
        footerBgColor: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '#f9fafb' },
        footerTextColor: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '#374151' },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
      });
    }
  },

  async down(queryInterface) {
    if (await queryInterface.tableExists('widget_customization_styles')) {
      await queryInterface.dropTable('widget_customization_styles');
    }
    if (await queryInterface.tableExists('widget_customizations')) {
      await queryInterface.dropTable('widget_customizations');
    }
  },
};
