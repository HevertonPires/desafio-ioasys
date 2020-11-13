export default (sequelize, Datatype) => {
  const filmesGeneros = sequelize.define('FilmesGeneros', {
    codigo: {
      type: Datatype.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    genero: {
      type: Datatype.INTEGER,
      allowNull: false,
      references: {
        key: 'codigo',
        model: 'Generos'
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

  return filmesGeneros
}
