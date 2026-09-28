'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('shops');
    if (!tableInfo.allowCustomization) {
      await queryInterface.addColumn('shops', 'allowCustomization', {
        type: Sequelize.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '0',
        comment: '0 = Disabled, 1 = Enabled',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('shops', 'allowCustomization');
  }
};
