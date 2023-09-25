// models/saladecirurgia.js

module.exports = (sequelize, DataTypes) => {
    const SalaDeCirurgia = sequelize.define('SalaDeCirurgia', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: DataTypes.STRING,
        nomeabreviado: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, 
    {
        tableName: 'SalasDeCirurgia'  // Informa explicitamente o nome da tabela
    });

    return SalaDeCirurgia;
};
