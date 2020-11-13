import Controller from './Controller'

export default class DiretoresController extends Controller {
  constructor (Diretores, req) {
    super(Diretores)
    this.request = req
  }
}
