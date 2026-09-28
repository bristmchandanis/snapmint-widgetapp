'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const tableDescription = await queryInterface.describeTable('auto_setups');
      if (!tableDescription.pdpSalePrice) {
        await queryInterface.addColumn('auto_setups', 'pdpSalePrice', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: '',
        });
      }
    } catch (error) {
      console.warn('Migration add pdpSalePrice note:', error.message);
    }
  },

  async down(queryInterface) {
    try {
      const tableDescription = await queryInterface.describeTable('auto_setups');
      if (tableDescription.pdpSalePrice) {
        await queryInterface.removeColumn('auto_setups', 'pdpSalePrice');
      }
    } catch (error) {
      console.warn('Migration remove pdpSalePrice note:', error.message);
    }
  },
};
