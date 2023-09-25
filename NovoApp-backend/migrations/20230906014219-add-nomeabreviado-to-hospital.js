module.exports = {
  up: function(queryInterface, Sequelize) {
      return queryInterface.addColumn(
          'Hospitais',
          'nomeabreviado',
          {
              type: Sequelize.STRING,
              allowNull: true
          }
      );
  },

  down: function(queryInterface, Sequelize) {
      return queryInterface.removeColumn('Hospitais', 'nomeabreviado');
  }
};
