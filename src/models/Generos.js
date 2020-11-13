export default (sequelize, Datatype) => {
  const generos = sequelize.define('Generos', {
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

  generos.associate = (models) => {
    generos.belongsToMany(models.Filmes, { through: { model: models.FilmesGeneros }, foreignKey: 'genero', as: 'genero' })
  }

  return generos
}
