'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Procedimentos', 'pacienteId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Pacientes',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Procedimentos', 'pacienteId');
  }
};
