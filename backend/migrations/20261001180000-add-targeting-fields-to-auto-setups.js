'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const tableDescription = await queryInterface.describeTable('auto_setups');

      if (!tableDescription.pdpFallbackSelector) {
        await queryInterface.addColumn('auto_setups', 'pdpFallbackSelector', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: '',
        });
      }

      if (!tableDescription.pdpRerenderOnVariant) {
        await queryInterface.addColumn('auto_setups', 'pdpRerenderOnVariant', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'on',
        });
      }

      if (!tableDescription.cartFallbackSelector) {
        await queryInterface.addColumn('auto_setups', 'cartFallbackSelector', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: '',
        });
      }

      if (!tableDescription.minCartFallbackSelector) {
        await queryInterface.addColumn('auto_setups', 'minCartFallbackSelector', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: '',
        });
      }

      if (!tableDescription.excludedProducts) {
        await queryInterface.addColumn('auto_setups', 'excludedProducts', {
          type: Sequelize.TEXT,
          allowNull: true,
          defaultValue: '',
        });
      }

      if (!tableDescription.excludedCollections) {
        await queryInterface.addColumn('auto_setups', 'excludedCollections', {
          type: Sequelize.TEXT,
          allowNull: true,
          defaultValue: '',
        });
      }

      // Convert placements to STRING to support 'inside start' and 'inside end'
      await queryInterface.changeColumn('auto_setups', 'pdpWidgetPlacement', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'after',
      });
      await queryInterface.changeColumn('auto_setups', 'cartWidgetPlacement', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'after',
      });
      if (tableDescription.cartDrawerWidgetPlacement) {
        await queryInterface.changeColumn('auto_setups', 'cartDrawerWidgetPlacement', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'after',
        });
      }
      if (tableDescription.minCartWidgetPlacement) {
        await queryInterface.changeColumn('auto_setups', 'minCartWidgetPlacement', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'after',
        });
      }
    } catch (error) {
      console.warn('Migration add-targeting-fields-to-auto-setups note:', error.message);
    }
  },

  async down(queryInterface) {
    try {
      const tableDescription = await queryInterface.describeTable('auto_setups');
      const cols = ['pdpFallbackSelector', 'pdpRerenderOnVariant', 'cartFallbackSelector', 'minCartFallbackSelector', 'excludedProducts', 'excludedCollections'];
      for (const col of cols) {
        if (tableDescription[col]) {
          await queryInterface.removeColumn('auto_setups', col);
        }
      }
    } catch (error) {
      console.warn('Migration rollback targeting fields note:', error.message);
    }
  },
};
