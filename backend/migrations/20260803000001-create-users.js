'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'EMPLOYEE'),
        allowNull: false,
        defaultValue: 'EMPLOYEE',
      },
      permissions: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          merchantOnboard: { view: true, create: true, edit: false },
          stores: { view: true, create: false, edit: false },
          widgetConfig: { view: true, create: false, edit: false },
          userManagement: { view: false, create: false, edit: false },
        },
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
