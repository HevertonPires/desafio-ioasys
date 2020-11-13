'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FilmesDiretores', {
      codigo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      genero: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'codigo',
          model: 'Generos'
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
    await queryInterface.dropTable('FilmesGeneros')
  }
}
