export default (sequelize, Datatype) => {
  const filmesAtores = sequelize.define('FilmesAtores', {
    codigo: {
      type: Datatype.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ator: {
      type: Datatype.INTEGER,
      allowNull: false,
      references: {
        key: 'codigo',
        model: 'Atores'
      }
    },
    filme: {
      type: Datatype.INTEGER,
      allowNull: false,
      references: {
        key: 'codigo',
        model: 'Filmes'
      }
    }
  })

  const filme = sequelize.import('./Filmes.js')
  const ator = sequelize.import('./Atores.js')

  filme.belongsToMany(ator, {
    through: { model: filmesAtores },
    foreignKey: 'ator'
  })

  ator.belongsToMany(filme, {
    through: { model: filmesAtores },
    foreignKey: 'filme'
  })

  return filmesAtores
}
