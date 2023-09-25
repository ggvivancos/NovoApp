module.exports = {
  up: function(queryInterface, Sequelize) {
      return queryInterface.addColumn(
          'Cirurgioes',
          'nomeabreviado',
          {
              type: Sequelize.STRING,
              allowNull: true
          }
      );
  },

  down: function(queryInterface, Sequelize) {
      return queryInterface.removeColumn('Cirurgioes', 'nomeabreviado');
  }
};
