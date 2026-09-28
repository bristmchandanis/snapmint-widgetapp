'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('shops');

    if (!tableInfo.hasWebPixel) {
      await queryInterface.addColumn('shops', 'hasWebPixel', {
        type: Sequelize.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '0',
        comment: '0 = Disabled, 1 = Enabled',
      });
    }

    if (!tableInfo.webPixelId) {
      await queryInterface.addColumn('shops', 'webPixelId', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Shopify Web Pixel ID',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('shops');

    if (tableInfo.hasWebPixel) {
      await queryInterface.removeColumn('shops', 'hasWebPixel');
    }

    if (tableInfo.webPixelId) {
      await queryInterface.removeColumn('shops', 'webPixelId');
    }
  }
};
