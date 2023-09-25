'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Procedimentos', 'VAD', {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        });

        await queryInterface.addColumn('Procedimentos', 'SaladeCirurgiaId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'SalasDeCirurgia',
                key: 'id'
            },
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Procedimentos', 'VAD');
        await queryInterface.removeColumn('Procedimentos', 'SalaDeCirurgiaId');
    }
};
