module.exports = (sequelize, DataTypes) => {
    const Procedimento = sequelize.define('Procedimento', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        anestesistaId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Anestesistas',
                key: 'id'
            }
        },
        grupodeanestesiaId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'GrupoDeAnestesia',
                key: 'id'
            }
        },
        hospitalId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Hospitais',
                key: 'id'
            }
        },
        setorId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Setores',
                key: 'id'
            }
        },
        cirurgiaoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Cirurgioes',
                key: 'id'
            }
        },
        cirurgiaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Cirurgias',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },

        VAD: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        SaladeCirurgiaId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'SalasDeCirurgia',
                key: 'id'
            }
        },

        horainicio: DataTypes.TIME,
        duracao: DataTypes.TIME,
        uti: DataTypes.BOOLEAN,
        apa: DataTypes.BOOLEAN,
        alergia: DataTypes.BOOLEAN,
        leito: DataTypes.STRING,
        observacao: DataTypes.TEXT,
        idade: DataTypes.INTEGER,
        datadenascimento: DataTypes.DATE,
        aviso: DataTypes.STRING,
        prontuario: DataTypes.STRING,
        convenio: DataTypes.STRING,
        lateralidade: DataTypes.STRING,
        alergialatex: DataTypes.BOOLEAN,
        pacote: DataTypes.BOOLEAN,
        datadacirurgia: DataTypes.DATE

    });

    Procedimento.associate = function(models) {
        Procedimento.belongsTo(models.Anestesista, {foreignKey: 'anestesistaId'});
        Procedimento.belongsTo(models.Hospital, {foreignKey: 'hospitalId'});
        Procedimento.belongsTo(models.Cirurgiao, {foreignKey: 'cirurgiaoId'});
        Procedimento.belongsTo(models.Cirurgia, {foreignKey: 'cirurgiaId'});
        Procedimento.belongsTo(models.Setor, {foreignKey: 'setorId'});
        Procedimento.belongsTo(models.GrupoDeAnestesia, {foreignKey: 'grupodeanestesiaId'});
        Procedimento.belongsTo(models.SalaDeCirurgia, {foreignKey: 'SaladeCirurgiaId'});
    }, 
    {
        tableName: 'Procedimentos'  // Informa explicitamente o nome da tabela
    };

    return Procedimento;
};

    