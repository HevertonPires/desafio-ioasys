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
    this.includesConsulta = []
  }

  async getAll () {
    try {
      const config = { include: this.includesConsulta }
      await this.antesGetAll(config)
      const result = await this.modelo.findAll(config)
      return defaultResponse(result)
    } catch (error) {
      console.log(error)
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async getAllFilter (params) {
    try {
      const config = {
        include: this.includesConsulta,
        where: {
          ...params
        }
      }
      await this.antesGetAllFilter(config)
      const result = await this.modelo.findAll(config)
      return defaultResponse(result)
    } catch (error) {
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async getById (params) {
    try {
      const config = {
        include: this.includesConsulta,
        where: {
          ...params
        }
      }
      await this.antesGetById(config)
      const result = await this.modelo.findOne(config)
      return defaultResponse(result)
    } catch (error) {
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async create (data) {
    try {
      await this.antesCriar(data)
      const result = await this.modelo.create(data, { include: [{ all: true }] })
      await this.depoisCriar(result)
      return defaultResponse(result, HttpStatus.CREATED)
    } catch (error) {
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async update (data, params) {
    try {
      const config = { where: params }
      await this.antesAtualizar(data, config)
      const registro = await this.modelo.findOne(config)
      if (!registro) return errorResponse(`Registro de código ${params.codigo} não encontrado`, HttpStatus.BAD_REQUEST)
      const result = await this.modelo.update(data, { where: params })
      await this.depoisAtualizar()
      return defaultResponse(result)
    } catch (error) {
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async delete ({ codigo }) {
    try {
      const registro = await this.modelo.findByPk(codigo)
      if (registro) {
        registro.ativo = false
        await registro.save()
        return defaultResponse({}, HttpStatus.NO_CONTENT)
      }
      return errorResponse(`Registro de código ${codigo} não encontrado`, HttpStatus.BAD_REQUEST)
    } catch (error) {
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  // #region *** Hooks ***
  async antesCriar (dadosBody) {}
  async antesAtualizar (dadosBody, configConsulta) {}
  async depoisCriar (registro) {}
  async depoisAtualizar (registroAnt, registroNew) { }
  async antesGetAll (configConsulta) {}
  async antesGetAllFilter (configConsulta) {}
  async antesGetOne (configConsulta) {}
  async antesGetById (configConsulta) {}
  // #endregion
}
