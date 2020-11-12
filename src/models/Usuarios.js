import Bcrypt from 'bcrypt'

export default (sequelize, Datatype) => {
  const usuarios = sequelize.define('Usuarios', {
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
    email: {
      type: Datatype.STRING,
      allowNull: false,
      unique: 'UQ_EMAIL',
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    senha: {
      type: Datatype.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    admin: {
      type: Datatype.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ativo: {
      type: Datatype.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    hooks: {
      beforeCreate (usuario) {
        const salt = Bcrypt.genSaltSync()

        usuario.set('senha', Bcrypt.hashSync(usuario.senha, salt))
      },
      beforeUpdate (usuario) {
        const salt = Bcrypt.genSaltSync()

        usuario.set('senha', Bcrypt.hashSync(usuario.senha, salt))
      }
    }
  })

  return usuarios
}
