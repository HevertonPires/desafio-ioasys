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
    },
    ativo: {
      type: Datatype.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  })

  return filmesAtores
}
