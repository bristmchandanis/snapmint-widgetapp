'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('widget_customizations');

    if (!tableInfo.tenure) {
      await queryInterface.addColumn('widget_customizations', 'tenure', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      });
    }

    if (!tableInfo.dpPercent) {
      await queryInterface.addColumn('widget_customizations', 'dpPercent', {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      });
    }

    if (!tableInfo.dpType) {
      await queryInterface.addColumn('widget_customizations', 'dpType', {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: null,
      });
    }

    if (!tableInfo.emiPercent) {
      await queryInterface.addColumn('widget_customizations', 'emiPercent', {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('widget_customizations');

    if (tableInfo.tenure) {
      await queryInterface.removeColumn('widget_customizations', 'tenure');
    }

    if (tableInfo.dpPercent) {
      await queryInterface.removeColumn('widget_customizations', 'dpPercent');
    }

    if (tableInfo.dpType) {
      await queryInterface.removeColumn('widget_customizations', 'dpType');
    }

    if (tableInfo.emiPercent) {
      await queryInterface.removeColumn('widget_customizations', 'emiPercent');
    }
  }
};
