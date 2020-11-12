export default (sequelize, Datatype) => {
  const atores = sequelize.define('Atores', {
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
  return atores
}
