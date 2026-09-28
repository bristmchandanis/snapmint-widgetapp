'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('roles', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        permissions: {
          type: Sequelize.JSON,
          allowNull: false,
          defaultValue: {},
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
    } catch (e) {
      console.warn('Migration create roles table note:', e.message);
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('roles');
  },
};
