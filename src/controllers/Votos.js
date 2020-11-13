import Controller from './Controller'

export default class VotosController extends Controller {
  constructor (Votos, req) {
    super(Votos)
    this.request = req
    this.includesConsulta = [{ association: 'filmes' }]
  }

  antesCriar (dadosBody) {
    dadosBody.usuario = this.request.userCodigo
  }

  antesAtualizar (dadosBody) {
    dadosBody.usuario = this.request.userCodigo
  }
}
