'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('shops');

    if (!tableInfo.colorConfig) {
      await queryInterface.addColumn('shops', 'colorConfig', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
        comment: 'JSON storing all store color configurations (innerLayoutColors & masterPopupColors)',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('shops');

    if (tableInfo.colorConfig) {
      await queryInterface.removeColumn('shops', 'colorConfig');
    }
  }
};
