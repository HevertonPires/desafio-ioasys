'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Votos', {
      codigo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      filme: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'codigo',
          model: 'Filmes'
        }
      },
      usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'codigo',
          model: 'Usuarios'
        }
      },
      avaliacao: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 4
        }
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Votos')
  }
}
