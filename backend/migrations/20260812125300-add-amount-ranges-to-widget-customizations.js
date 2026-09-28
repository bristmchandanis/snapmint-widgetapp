'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('widget_customizations');
    
    if (!tableInfo.minAmount) {
      await queryInterface.addColumn('widget_customizations', 'minAmount', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 200,
      });
    }

    if (!tableInfo.maxAmount) {
      await queryInterface.addColumn('widget_customizations', 'maxAmount', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 3000,
      });
    }

    if (!tableInfo.isCustomRange) {
      await queryInterface.addColumn('widget_customizations', 'isCustomRange', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('widget_customizations');

    if (tableInfo.minAmount) {
      await queryInterface.removeColumn('widget_customizations', 'minAmount');
    }
    
    if (tableInfo.maxAmount) {
      await queryInterface.removeColumn('widget_customizations', 'maxAmount');
    }
    
    if (tableInfo.isCustomRange) {
      await queryInterface.removeColumn('widget_customizations', 'isCustomRange');
    }
  }
};
