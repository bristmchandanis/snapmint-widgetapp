'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    if (!(await queryInterface.tableExists('auto_setups'))) {
      await queryInterface.createTable('auto_setups', {
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

        // Collection Selectors
        collectionGridItem: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        collectionSalePrice: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        collectionProductId: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        collectionProductHandle: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        collectionProductName: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        collectionVariantId: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        collectionProductAvailable: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        collectionProductUrl: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        collectionWidgetAppendTarget: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        collectionWidgetPlacement: {
          type: Sequelize.ENUM('before', 'after'),
          allowNull: false,
          defaultValue: 'after',
        },

        // PDP Selectors
        pdpPriceSelector: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        pdpProductId: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        pdpProductHandle: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        pdpProductName: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        pdpVariantId: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        pdpProductAvailable: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        pdpProductUrl: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        pdpWidgetAppendTarget: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        pdpWidgetPlacement: {
          type: Sequelize.ENUM('before', 'after'),
          allowNull: false,
          defaultValue: 'after',
        },

        // Cart Selectors
        cartItem: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        cartTotal: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        cartWidgetAppendTarget: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        cartWidgetPlacement: {
          type: Sequelize.ENUM('before', 'after'),
          allowNull: false,
          defaultValue: 'after',
        },

        // Mini Cart Selectors
        minCartItem: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        minCartTotal: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        minCartWidgetAppendTarget: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        minCartWidgetPlacement: {
          type: Sequelize.ENUM('before', 'after'),
          allowNull: false,
          defaultValue: 'after',
        },

        // Cart Drawer Selectors
        cartDrawerItem: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        cartDrawerTotal: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        cartDrawerWidgetAppendTarget: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
        cartDrawerWidgetPlacement: {
          type: Sequelize.ENUM('before', 'after'),
          allowNull: false,
          defaultValue: 'after',
        },

        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
      });
    }
  },

  async down(queryInterface) {
    if (await queryInterface.tableExists('auto_setups')) {
      await queryInterface.dropTable('auto_setups');
    }
  },
};
