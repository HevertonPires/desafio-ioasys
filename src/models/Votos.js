export default (sequelize, Datatype) => {
  const votos = sequelize.define('Votos', {
    codigo: {
      type: Datatype.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    filme: {
      type: Datatype.INTEGER,
      allowNull: false,
      references: {
        key: 'codigo',
        model: 'Filmes'
      }
    },
    usuario: {
      type: Datatype.INTEGER,
      allowNull: false,
      references: {
        key: 'codigo',
        model: 'Usuarios'
      }
    },
    avaliacao: {
      type: Datatype.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 4
      }
    },
    ativo: {
      type: Datatype.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  })

  votos.associate = (models) => {
    votos.belongsTo(models.Usuarios, { foreignKey: 'usuario', as: 'usuarios' })
    votos.belongsTo(models.Filmes, { foreignKey: 'filme', as: 'filmes' })
  }

  return votos
}
