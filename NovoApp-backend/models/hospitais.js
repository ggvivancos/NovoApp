module.exports = (sequelize, DataTypes) => {
    const Hospital = sequelize.define('Hospital', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: DataTypes.STRING,
        cor: DataTypes.STRING,
        nomeabreviado: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, 
    {
        tableName: 'Hospitais'  // Informa explicitamente o nome da tabela
    });

    Hospital.associate = models => {
        Hospital.hasMany(models.Setor, {
            foreignKey: 'hospitalId',
            as: 'setores'
        });
    };

    return Hospital;
};
