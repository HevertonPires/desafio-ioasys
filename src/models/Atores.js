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
    },
    ativo: {
      type: Datatype.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  })

  atores.associate = (models) => {
    atores.belongsToMany(models.Filmes, { through: { model: models.FilmesAtores }, foreignKey: 'ator', as: 'ator' })
  }

  return atores
}
