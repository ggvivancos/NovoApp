module.exports = (sequelize, DataTypes) => {
    const Cirurgia = sequelize.define('Cirurgia', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        codigoTUSS: DataTypes.STRING,
        nome: DataTypes.STRING
    }, 
    {
        tableName: 'Cirurgias'  // Informa explicitamente o nome da tabela
    });
    

    return Cirurgia;
};
