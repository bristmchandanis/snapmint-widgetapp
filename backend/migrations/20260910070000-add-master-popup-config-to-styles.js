'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('widget_customization_styles', 'masterPopupConfig', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {},
      comment: 'JSON payload storing all master popup modal customizer fields including toggles, text overrides, dropdown selections',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('widget_customization_styles', 'masterPopupConfig');
  },
};
