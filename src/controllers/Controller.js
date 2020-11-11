import HttpStatus from 'http-status'

const defaultResponse = (data, statusCode = HttpStatus.OK) => ({
  data,
  statusCode
})

const errorResponse = (data, statusCode = HttpStatus.BAD_REQUEST) => ({
  data,
  statusCode
})

export default class Controller {
  constructor (Classe) {
    this.modelo = Classe
  }

  getAll () {
    return this.modelo.findAll()
      .then(result => defaultResponse(result))
      .catch(error => errorResponse(error.message))
  }

  getAllFilter (params) {
    return this.modelo.findAll(params)
      .then(result => defaultResponse(result))
      .catch(error => errorResponse(error.message))
  }

  getById (params) {
    return this.modelo.findByPk(params.id)
      .then(result => defaultResponse(result))
      .catch(error => errorResponse(error.message))
  }

  findOne (params) {
    return this.modelo.findOne(params)
      .then(result => defaultResponse(result))
      .catch(error => errorResponse(error.message))
  }

  create (data) {
    return this.modelo.create(data)
      .then(result => defaultResponse(result, HttpStatus.CREATED))
      .catch(error => errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY))
  }

  update (data, params) {
    return this.modelo.update(data, {
      where: params
    })
      .then(result => defaultResponse(result))
      .catch(error => errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY))
  }

  delete (params) {
    return this.modelo.destroy({
      where: params
    })
      .then(result => defaultResponse(result, HttpStatus.NO_CONTENT))
      .catch(error => errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY))
  }
}
