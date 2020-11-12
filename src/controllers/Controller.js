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
      const result = await this.controle.findAll({
        include: this.includesConsulta,
        where: { ativo: true }
      })
      return defaultResponse(result)
    } catch (error) {
      console.log(error)
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async getAllFilter (params) {
    try {
      params.ativo = true
      const result = await this.controle.findAll({ where: params })
      return defaultResponse(result)
    } catch (error) {
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async getById (params) {
    try {
      const result = await this.controle.findByPk(params.codigo, {
        include: this.includesConsulta,
        where: { ativo: true }
      })
      return defaultResponse(result)
    } catch (error) {
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async getOne (params) {
    try {
      params.ativo = true
      const result = await this.controle.findOne({ where: params })
      return defaultResponse(result)
    } catch (error) {
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async create (data) {
    try {
      await this.antesCriar(data)
      const result = await this.modelo.create(data)
      await this.depoisCriar(result)
      return defaultResponse(result, HttpStatus.CREATED)
    } catch (error) {
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async update (data, params) {
    try {
      params.ativo = true
      const registro = await this.modelo.findOne({ where: params })
      if (!registro) return errorResponse(`Registro de código ${params.codigo} não encontrado`, HttpStatus.BAD_REQUEST)
      await this.antesAtualizar(data)
      const result = await this.modelo.update(data, { where: params })
      await this.depoisAtualizar()
      return defaultResponse(result)
    } catch (error) {
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async delete ({ codigo }) {
    try {
      const registro = await this.modelo.findByPk(codigo, { where: { ativo: true } })
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
  async antesAtualizar (dadosBody) {}
  async depoisCriar (registro) {}
  async depoisAtualizar (registroAnt, registroNew) {}
  // #endregion
}
