'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    if (!(await queryInterface.tableExists('widgets'))) {
      await queryInterface.createTable('widgets', {
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
        plans: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: [],
        },
        priceBands: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: {},
        },
        configure: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: {},
        },
        customization: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: {},
        },
        targeting: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: {},
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
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
    }
  },

  async down(queryInterface, Sequelize) {
    if (await queryInterface.tableExists('widgets')) {
      await queryInterface.dropTable('widgets');
    }
  },
};
