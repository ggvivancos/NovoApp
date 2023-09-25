'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Anestesistas', {
      fields: ['nomecompleto'],
      type: 'unique',
      name: 'unique_constraint_nomecompleto'
    });

    await queryInterface.addConstraint('Anestesistas', {
      fields: ['nomeabreviado'],
      type: 'unique',
      name: 'unique_constraint_nomeabreviado'
    });

    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Anestesistas', 'unique_constraint_nomecompleto');
    await queryInterface.removeConstraint('Anestesistas', 'unique_constraint_nomeabreviado');
    
  }
};
