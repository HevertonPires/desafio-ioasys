import HttpStatus from 'http-status'
import Controller from './Controller'
import jwt from 'jwt-simple'
import Bcrypt from 'bcrypt'

export default class UsuariosController extends Controller {
  constructor (Usuarios, req) {
    super(Usuarios)
    this.request = req
  }

  isSenha (hashSenha, senha) {
    return Bcrypt.compareSync(senha, hashSenha)
  }

  async autenticar (req, res) {
    const { email, senha } = req.body

    if (!email) res.status(HttpStatus.BAD_REQUEST).json('Campo email obrigatório!')
    if (!senha) res.status(HttpStatus.BAD_REQUEST).json('Campo senha obrigatório!')

    try {
      const usuario = await this.modelo.findOne({ where: { email } })
      if (usuario && this.isSenha(usuario.senha, senha)) {
        const token = jwt.encode({ codigo: usuario.codigo, admin: usuario.admin }, process.env.JWT_SECRET)
        return res.status(HttpStatus.OK).json({ usuario, token })
      }
      res.status(HttpStatus.UNAUTHORIZED).json('Login ou senha incorreto(s)')
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json(error.message)
    }
  }

  antesCriar (dadosBody) {
    if (this.request.path.includes('/usuario', 0)) {
      dadosBody.admin = false
      return
    }
    dadosBody.admin = true
  }

  antesAtualizar (dadosBody, configConsulta) {
    if (!this.request.userAdm) { // se não é um usuario adiministrador
      if (this.request.path.includes('/usuario', 0)) configConsulta.where.admin = false // define filtro somente para usuarios não administradores
      if (dadosBody?.admin) delete dadosBody.admin // remove a propriedade pois usuario não pode definir a mesma
    }
  }

  _filterConsultas (config) {
    if (this.request.path.includes('/admin', 0)) {
      Object.assign(config, { where: { admin: true } }) // Gets para admin só pode aparecer admins
      return
    }

    Object.assign(config, { where: { admin: false } }) // Gets para usuarios só pode aparecer usuarios
  }

  antesGetAll (config) {
    this._filterConsultas(config)
  }

  antesGetById (config) {
    this._filterConsultas(config)
  }
}
