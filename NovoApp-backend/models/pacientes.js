'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Paciente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Paciente.init({
    nomecompleto: DataTypes.STRING,
    datadenascimento: DataTypes.DATE,
    idade: DataTypes.INTEGER,
    VAD: DataTypes.BOOLEAN,
    alergia: DataTypes.BOOLEAN,
    alergialatex: DataTypes.BOOLEAN,
    prontuario: DataTypes.STRING,
    CPF: DataTypes.STRING,
    RG: DataTypes.STRING,
    telefone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Paciente',
  });
  {
    tableName: 'Pacientes'  // Informa explicitamente o nome da tabela
};
  return Paciente;
};