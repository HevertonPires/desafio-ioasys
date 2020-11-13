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
    },
    ativo: {
      type: Datatype.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  })

  diretores.associate = (models) => {
    diretores.belongsToMany(models.Filmes, { through: { model: models.FilmesDiretores }, foreignKey: 'diretor', as: 'diretor' })
  }

  return diretores
}
