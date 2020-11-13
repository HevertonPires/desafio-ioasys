import Controller from './Controller'

export default class AtoresController extends Controller {
  constructor (Atores, req) {
    super(Atores)
    this.request = req
  }
}
