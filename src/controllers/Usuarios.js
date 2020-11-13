import HttpStatus from 'http-status'
import Controller from './Controller'
import jwt from 'jwt-simple'
import Bcrypt from 'bcrypt'

export default class UsuariosController extends Controller {
  // eslint-disable-next-line no-useless-constructor
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
      dadosBody.admin = true
      return
    }
    dadosBody.admin = false
    ''.includes()
  }

  antesAtualizar (dadosBody, configConsulta) {
    if (this.request.path.includes('/usuario', 0)) {
      dadosBody.admin = false
    }
    if (!this.request.userAdm) configConsulta.where.admin = false
  }

  _filterConsultas (config) {
    Object.assign(config, { where: { ativo: true, admin: this.request.userAdm } })
  }

  antesGetAll (config) {
    this._filterConsultas(config)
  }

  antesGetAllFilter (config) {
    this._filterConsultas(config)
  }

  antesGetById (config) {
    this._filterConsultas(config)
  }
}
