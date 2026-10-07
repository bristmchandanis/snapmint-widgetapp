'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('merchant_credentials');

    if (!tableInfo.name) {
      await queryInterface.addColumn('merchant_credentials', 'name', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.brandingMode) {
      await queryInterface.addColumn('merchant_credentials', 'brandingMode', {
        type: Sequelize.ENUM('snapmint', 'co-branded', 'white-label'),
        allowNull: false,
        defaultValue: 'snapmint',
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('merchant_credentials', 'name');
    await queryInterface.removeColumn('merchant_credentials', 'brandingMode');
  },
};
