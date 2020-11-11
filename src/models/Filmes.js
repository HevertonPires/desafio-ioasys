export default (sequelize, Datatype) => {
  const filmes = sequelize.define('Filmes', {
    codigo: {
      type: Datatype.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: Datatype.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  })

  return filmes
}
