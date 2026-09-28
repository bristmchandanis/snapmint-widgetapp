'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const tableDescription = await queryInterface.describeTable('cashback_offers');

      if (!tableDescription.limitedDealText) {
        await queryInterface.addColumn('cashback_offers', 'limitedDealText', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'LIMITED TIME DEAL',
        });
      }

      if (!tableDescription.noteText) {
        await queryInterface.addColumn('cashback_offers', 'noteText', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'Offer will change for order value greater than ₹3000 and users with no credit history. *T&C',
        });
      }

      if (tableDescription.isLimitedDeal) {
        await queryInterface.removeColumn('cashback_offers', 'isLimitedDeal');
      }

      if (tableDescription.minOrderValue) {
        await queryInterface.removeColumn('cashback_offers', 'minOrderValue');
      }
    } catch (error) {
      console.warn('Migration update cashback_offers table fields warning:', error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      const tableDescription = await queryInterface.describeTable('cashback_offers');

      if (!tableDescription.isLimitedDeal) {
        await queryInterface.addColumn('cashback_offers', 'isLimitedDeal', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        });
      }

      if (!tableDescription.minOrderValue) {
        await queryInterface.addColumn('cashback_offers', 'minOrderValue', {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.00,
        });
      }

      if (tableDescription.limitedDealText) {
        await queryInterface.removeColumn('cashback_offers', 'limitedDealText');
      }

      if (tableDescription.noteText) {
        await queryInterface.removeColumn('cashback_offers', 'noteText');
      }
    } catch (error) {
      console.warn('Migration rollback update cashback_offers table fields warning:', error.message);
    }
  },
};
