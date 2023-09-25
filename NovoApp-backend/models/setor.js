module.exports = (sequelize, DataTypes) => {
    const Setor = sequelize.define('Setor', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: DataTypes.STRING,
        nomeabreviado: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        tableName: 'Setores'  // Informa explicitamente o nome da tabela
    });

    Setor.associate = models => {
        Setor.belongsTo(models.Hospital, {
            foreignKey: 'hospitalId',
            as: 'hospital'
        });
    };

    return Setor;
};
