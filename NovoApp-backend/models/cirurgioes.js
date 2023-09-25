module.exports = (sequelize, DataTypes) => {
    const Cirurgiao = sequelize.define('Cirurgiao', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: DataTypes.STRING,
        especialidade: DataTypes.STRING,
        nomeabreviado: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, 
    {
        tableName: 'Cirurgioes'  // Informa explicitamente o nome da tabela
    });

    return Cirurgiao;
};
