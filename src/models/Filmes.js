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

  filmes.associate = (models) => {
    filmes.hasMany(models.Atores, { foreignKey: 'filme' })
    filmes.hasMany(models.Generos, { foreignKey: 'filme' })
    filmes.hasMany(models.Diretores, { foreignKey: 'filme' })
  }

  return filmes
}
