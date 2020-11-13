'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FilmesAtores', {
      codigo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ator: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'codigo',
          model: 'Atores'
        }
      },
      filme: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'codigo',
          model: 'Filmes'
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
    await queryInterface.dropTable('FilmesAtores')
  }
}
