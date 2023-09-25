'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Adiciona a nova coluna
        await queryInterface.addColumn('Anestesistas', 'grupodeanestesiaId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'GrupoDeAnestesias', // nome da tabela
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
        
        // Remove a coluna antiga
        await queryInterface.removeColumn('Anestesistas', 'grupodeanestesia');
    },

    down: async (queryInterface, Sequelize) => {
        // No rollback, primeiro recriamos a coluna antiga
        await queryInterface.addColumn('Anestesistas', 'grupodeanestesia', {
            type: Sequelize.STRING
        });
        
        // E depois removemos a nova coluna
        await queryInterface.removeColumn('Anestesistas', 'grupodeanestesiaId');
    }
};
