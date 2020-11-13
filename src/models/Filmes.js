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
    },
    ativo: {
      type: Datatype.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  })

  filmes.associate = (models) => {
    filmes.belongsToMany(models.Atores, { through: { model: models.FilmesAtores }, foreignKey: 'filme', as: 'atores' })
    filmes.belongsToMany(models.Generos, { through: { model: models.FilmesGeneros }, foreignKey: 'filme', as: 'generos' })
    filmes.belongsToMany(models.Diretores, { through: { model: models.FilmesDiretores }, foreignKey: 'filme', as: 'diretores' })
    filmes.hasMany(models.Votos, { foreignKey: 'filme', as: 'votos' })
  }

  return filmes
}
