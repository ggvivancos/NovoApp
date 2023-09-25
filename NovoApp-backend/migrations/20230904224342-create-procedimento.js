'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Procedimentos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      anestesistaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Anestesistas',
          key: 'id'
        },
        allowNull: false
      },
      hospitalId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Hospitais',
          key: 'id'
        },
        allowNull: false
      },
      cirurgiaoId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Cirurgioes',
          key: 'id'
        },
        allowNull: false
      },
      cirurgiaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Cirurgias',
          key: 'id'
        },
        allowNull: false
      },
      horainicio: {
        type: Sequelize.TIME
      },
      duracao: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Procedimentos');
  }
};
