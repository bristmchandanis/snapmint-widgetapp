'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('merchant_credentials');
    if (tableInfo.token) {
      await queryInterface.changeColumn('merchant_credentials', 'token', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('merchant_credentials');
    if (tableInfo.token) {
      await queryInterface.changeColumn('merchant_credentials', 'token', {
        type: Sequelize.TEXT,
        allowNull: false,
      });
    }
  },
};
