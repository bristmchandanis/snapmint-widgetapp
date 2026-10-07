'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    if (!(await queryInterface.tableExists('coupons'))) {
      await queryInterface.createTable('coupons', {
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
        myshopifyDomain: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        shopifyDiscountId: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        code: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        discountType: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'PERCENTAGE',
        },
        discountValue: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.00,
        },
        isSelectable: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: 'Whether selectable by shopper on storefront widget',
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'ACTIVE',
        },
        startsAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        endsAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        summary: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        source: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'Synced from Shopify',
        },
        needsRecheck: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        rawPayload: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      // Indexes
      await queryInterface.addIndex('coupons', ['shopId', 'code'], {
        unique: true,
        name: 'coupons_shop_id_code_unique',
      });
      await queryInterface.addIndex('coupons', ['myshopifyDomain'], {
        name: 'coupons_myshopify_domain',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    if (await queryInterface.tableExists('coupons')) {
      await queryInterface.dropTable('coupons');
    }
  },
};
