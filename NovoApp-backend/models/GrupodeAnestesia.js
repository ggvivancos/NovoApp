module.exports = (sequelize, DataTypes) => {
   
    const GrupoDeAnestesia = sequelize.define('GrupoDeAnestesia', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nomeabreviado: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'GrupoDeAnestesias'  // Informa explicitamente o nome da tabela
    });

    //GrupoDeAnestesia.hasMany(Anestesista, { foreignKey: 'grupodeanestesiaId', as: 'anestesistas' });

    return GrupoDeAnestesia;
};
