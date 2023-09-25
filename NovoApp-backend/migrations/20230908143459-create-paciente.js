'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pacientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomecompleto: {
        type: Sequelize.STRING
      },
      datadenascimento: {
        type: Sequelize.DATE
      },
      idade: {
        type: Sequelize.INTEGER
      },
      VAD: {
        type: Sequelize.BOOLEAN
      },
      alergia: {
        type: Sequelize.BOOLEAN
      },
      alergialatex: {
        type: Sequelize.BOOLEAN
      },
      prontuario: {
        type: Sequelize.STRING
      },
      CPF: {
        type: Sequelize.STRING
      },
      RG: {
        type: Sequelize.STRING
      },
      telefone: {
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pacientes');
  }
};