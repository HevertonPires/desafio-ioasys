import Controller from './Controller'

export default class FilmesController extends Controller {
  constructor (Filmes, req) {
    super(Filmes)
    this.request = req
    this.includesConsulta = [{
      association: 'diretores',
      through: {
        attributes: []
      }
    }, {
      association: 'atores',
      through: {
        attributes: []
      }
    }, {
      association: 'generos',
      through: {
        attributes: []
      }
    }, {
      association: 'votos',
      include: [{ association: 'usuarios', attributes: ['codigo', 'nome'] }]
    }]
  }

  _calcularMediaVotos (votos) {
    const dadosMedia = votos.reduce((acc, val) => {
      acc.somaTotal += val.avaliacao
      acc.quantidade += 1
      return acc
    }, {
      somaTotal: 0,
      quantidade: 0
    })

    return parseFloat((dadosMedia.somaTotal / dadosMedia.quantidade).toFixed(2))
  }

  depoisGetAll (registros) {
    for (const registro of registros) {
      registro.dataValues.mediaVotos = this._calcularMediaVotos(registro.votos) || 0
    }
  }

  depoisGetById (registro) {
    if (!registro) return
    registro.dataValues.mediaVotos = this._calcularMediaVotos(registro.votos) || 0
  }
}
