'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const tableExists = tables.includes('cashback_offers');

    if (!tableExists) {
      await queryInterface.createTable('cashback_offers', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        shopId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'shops',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'Mega Cashback Offer',
        },
        status: {
          type: Sequelize.ENUM('ACTIVE', 'EXPIRED'),
          allowNull: false,
          defaultValue: 'ACTIVE',
        },
        cashbackType: {
          type: Sequelize.ENUM('PERCENTAGE', 'FLAT'),
          allowNull: false,
          defaultValue: 'PERCENTAGE',
        },
        cashbackValue: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 10.00,
        },
        extraDiscountPercent: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: true,
          defaultValue: 5.00,
        },
        ribbonBadgeText: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: '10% Snapmint Cashback T&C',
        },
        minOrderValue: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.00,
        },
        isLimitedDeal: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        cashbackCreditDays: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 15,
        },
        termsAndConditions: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW'),
        },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes('cashback_offers')) {
      await queryInterface.dropTable('cashback_offers');
    }
  },
};
