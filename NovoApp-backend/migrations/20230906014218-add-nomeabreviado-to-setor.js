module.exports = {
  up: function(queryInterface, Sequelize) {
      return queryInterface.addColumn(
          'Setores',
          'nomeabreviado',
          {
              type: Sequelize.STRING,
              allowNull: true
          }
      );
  },

  down: function(queryInterface, Sequelize) {
      return queryInterface.removeColumn('Setores', 'nomeabreviado');
  }
};
