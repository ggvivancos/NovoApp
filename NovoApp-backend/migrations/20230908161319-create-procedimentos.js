'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Procedimentos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      anestesistaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Anestesistas',
          key: 'id'
        }
      },
      grupodeanestesiaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'GrupoDeAnestesias',
          key: 'id'
        }
      },
      hospitalId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Hospitais',
          key: 'id'
        }
      },
      setorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Setores',
          key: 'id'
        }
      },
      cirurgiaoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Cirurgioes',
          key: 'id'
        }
      },
      cirurgiaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Cirurgias',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      VAD: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      SaladeCirurgiaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'SalasDeCirurgia',
          key: 'id'
        }
      },
      horainicio: {
        type: Sequelize.TIME,
        allowNull: false
      },
      duracao: {
        type: Sequelize.TIME,
        allowNull: false
      },
      uti: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      apa: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      leito: {
        type: Sequelize.STRING,
        allowNull: true
      },
      observacao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      aviso: {
        type: Sequelize.STRING,
        allowNull: true
      },
      convenio: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lateralidade: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pacote: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      datadacirurgia: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Procedimentos');
  }
};
