'use strict'
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync()

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Usuarios', [
      {
        nome: 'Admin',
        email: 'admin@ioasys.com',
        senha: bcrypt.hashSync('123', salt),
        ativo: true,
        admin: true
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Usuarios', null, {})
  }
}
