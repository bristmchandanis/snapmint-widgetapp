'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    if (await queryInterface.tableExists('auto_setups')) {
      await queryInterface.dropTable('auto_setups', { cascade: true });
    }
  },

  async down(queryInterface, Sequelize) {
    if (!(await queryInterface.tableExists('auto_setups'))) {
      await queryInterface.createTable('auto_setups', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        shopId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'shops', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
      });
    }
  },
};
