'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {



        await queryInterface.addColumn('Procedimentos', 'datadacirurgia', {
            type: Sequelize.DATE,
            allowNull: false,
        
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Aqui, você deve fazer o oposto do que foi feito acima para reverter as mudanças.
        // Use queryInterface.removeColumn para cada coluna adicionada.
    }
};
