export const DB = {
  database: process.env.BD_NOME,
  username: process.env.BD_USUARIO,
  password: process.env.BD_SENHA,
  params: {
    host: process.env.BD_HOST,
    port: process.env.BD_PORTA,
    dialect: 'mariadb',
    define: {
      timestamps: false
    },
    dialectOptions: {
      useUTC: false,
      timezone: 'Etc/GMT-3'
    },
    benchmark: false,
    logging: true
  }
}
