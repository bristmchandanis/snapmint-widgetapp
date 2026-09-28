'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activity_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userRole: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shopDomain: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      module: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'SYSTEM',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'DASHBOARD',
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

    // Create Indexes for optimized query performance
    await queryInterface.addIndex('activity_logs', ['userId']);
    await queryInterface.addIndex('activity_logs', ['module']);
    await queryInterface.addIndex('activity_logs', ['source']);
    await queryInterface.addIndex('activity_logs', ['createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('activity_logs');
  },
};
