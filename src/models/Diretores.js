export default (sequelize, Datatype) => {
  const diretores = sequelize.define('Diretores', {
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

  return diretores
}
