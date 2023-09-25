'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Procedimentos', 'setorId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Setores',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        await queryInterface.addColumn('Procedimentos', 'status', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Procedimentos', 'setorId');
        await queryInterface.removeColumn('Procedimentos', 'status');
    }
};
