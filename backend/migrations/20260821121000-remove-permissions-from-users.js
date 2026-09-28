'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      const tableDescription = await queryInterface.describeTable('users');
      if (tableDescription.permissions) {
        await queryInterface.removeColumn('users', 'permissions');
      }
    } catch (error) {
      console.warn('Migration remove permissions from users note:', error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      const tableDescription = await queryInterface.describeTable('users');
      if (!tableDescription.permissions) {
        await queryInterface.addColumn('users', 'permissions', {
          type: Sequelize.JSON,
          allowNull: true,
        });
      }
    } catch (error) {
      console.warn('Migration add permissions to users note:', error.message);
    }
  },
};
