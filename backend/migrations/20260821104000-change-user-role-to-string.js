'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // In PostgreSQL, alter column type from enum to varchar
      await queryInterface.sequelize.query(
        'ALTER TABLE "users" ALTER COLUMN "role" TYPE VARCHAR(255) USING "role"::VARCHAR(255);'
      );
    } catch (e) {
      console.warn('Postgres SQL alter role enum note:', e.message);
      try {
        await queryInterface.changeColumn('users', 'role', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'EMPLOYEE',
        });
      } catch (err) {
        console.warn('Fallback changeColumn role note:', err.message);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.changeColumn('users', 'role', {
        type: Sequelize.ENUM('ADMIN', 'EMPLOYEE'),
        allowNull: false,
        defaultValue: 'EMPLOYEE',
      });
    } catch (e) {
      console.warn('Revert role enum note:', e.message);
    }
  },
};
