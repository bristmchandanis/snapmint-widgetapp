'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('widget_customizations');

    // 1. Add isActive column if not present
    if (!tableInfo.isActive) {
      await queryInterface.addColumn('widget_customizations', 'isActive', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }

    // 2. Deactivate older duplicate active widgets (keep highest ID active)
    await queryInterface.sequelize.query(`
      UPDATE widget_customizations
      SET "isActive" = false
      WHERE id NOT IN (
        SELECT MAX(id)
        FROM widget_customizations
        WHERE "isActive" = true
        GROUP BY "shopId", "minAmount", "maxAmount"
      )
      AND "isActive" = true;
    `);

    // 3. Reactivate the highest ID remaining widget for any price range band that currently has 0 active widgets
    await queryInterface.sequelize.query(`
      UPDATE widget_customizations
      SET "isActive" = true
      WHERE id IN (
        SELECT MAX(id)
        FROM widget_customizations
        WHERE ("shopId", "minAmount", "maxAmount") IN (
          SELECT "shopId", "minAmount", "maxAmount"
          FROM widget_customizations
          GROUP BY "shopId", "minAmount", "maxAmount"
          HAVING COUNT(CASE WHEN "isActive" = true THEN 1 END) = 0
        )
        GROUP BY "shopId", "minAmount", "maxAmount"
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('widget_customizations');

    if (tableInfo.isActive) {
      await queryInterface.removeColumn('widget_customizations', 'isActive');
    }
  }
};
