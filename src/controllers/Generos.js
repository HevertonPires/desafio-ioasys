import Controller from './Controller'

export default class GenerosController extends Controller {
  constructor (Generos, req) {
    super(Generos)
    this.request = req
  }
}
