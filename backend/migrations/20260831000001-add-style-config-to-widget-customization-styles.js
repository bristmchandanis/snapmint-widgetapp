'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('widget_customization_styles');

    if (!tableInfo.inlineWidgetConfig) {
      await queryInterface.addColumn('widget_customization_styles', 'inlineWidgetConfig', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
      });
    }

    if (tableInfo.styleConfig) {
      await queryInterface.sequelize.query(`
        UPDATE widget_customization_styles
        SET "inlineWidgetConfig" = "styleConfig"
        WHERE "styleConfig" IS NOT NULL AND ("inlineWidgetConfig" IS NULL OR "inlineWidgetConfig"::text = '{}');
      `).catch(() => {});
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('widget_customization_styles');

    if (tableInfo.inlineWidgetConfig) {
      await queryInterface.removeColumn('widget_customization_styles', 'inlineWidgetConfig');
    }
  }
};
