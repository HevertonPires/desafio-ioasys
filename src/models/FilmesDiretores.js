export default (sequelize, Datatype) => {
  const filmesDiretores = sequelize.define('FilmesDiretores', {
    codigo: {
      type: Datatype.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    diretor: {
      type: Datatype.INTEGER,
      allowNull: false,
      references: {
        key: 'codigo',
        model: 'Diretores'
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

  return filmesDiretores
}
