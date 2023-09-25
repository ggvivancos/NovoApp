module.exports = (sequelize, DataTypes) => {
    
    const Anestesista = sequelize.define('Anestesista', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
            },
                nomecompleto: {
                type: DataTypes.STRING,
                unique: true
            },
            nomeabreviado: {
                type: DataTypes.STRING,
                unique: true
            },
            iniciais: {
                type: DataTypes.STRING,
            },
            grupodeanestesiaId: {
                type: DataTypes.INTEGER
                // Removemos a parte de referências aqui, pois vamos definir isso em index.js
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
            
    }, 
    {
        tableName: 'Anestesistas'  // Informa explicitamente o nome da tabela
    });

    return Anestesista;
};
