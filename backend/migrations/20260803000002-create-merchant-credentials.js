'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('merchant_credentials', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      shop: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      merchantId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      appInstall: {
        type: Sequelize.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '0',
      },
      createdBy: {
        type: Sequelize.INTEGER,
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('merchant_credentials');
  },
};
