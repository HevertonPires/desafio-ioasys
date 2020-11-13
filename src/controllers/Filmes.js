import Controller from './Controller'

export default class FilmesController extends Controller {
  // eslint-disable-next-line no-useless-constructor
  constructor (Filmes, req) {
    super(Filmes)
    this.includesConsulta = [{ all: true, attributes: { through: [] } }]
  }

  // antesCriar(dadosBody) {
  //   if (this.request.path === '/admin') {
  //     dadosBody.admin = true
  //     return
  //   }
  //   dadosBody.admin = false
  // }

  // antesAtualizar(dadosBody) {
  //   if (this.request.path === '/usuario') {
  //     dadosBody.admin = false
  //   }
  // }

  // _filterConsultas(config) {
  //   if (this.request.path === '/admin') {
  //     config.where.admin = true
  //     return
  //   }
  //   config.where.admin = false
  // }

  // antesGetAll(config) {
  //   this._filterConsultas(config)
  // }

  // antesGetAllFilter(config) {
  //   this._filterConsultas(config)
  // }

  // antesGetById(config) {
  //   this._filterConsultas(config)
  // }
}
