import HttpStatus from 'http-status'
import { Sequelize } from 'sequelize'
import { cloneDeep } from 'lodash'
import { CONDICAO_BUSCA, OPCOES_CONDICAO_BUSCA } from '../enumerations/CondicaoBusca'

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

  async getAllFilter (params) {
    const args = {
      include: cloneDeep(this.includesConsulta),
      where: { [Sequelize.Op.and]: [], ativo: true }
    }

    this._processarFiltros(cloneDeep(params.filtros), args)

    try {
      await this.antesGetAll(args)
      const registros = await this.modelo.findAll(args)
      await this.depoisGetAll(registros)
      return defaultResponse(registros)
    } catch (error) {
      return errorResponse(error.message)
    }
  }

  async getById (params) {
    try {
      const config = {
        include: this.includesConsulta,
        where: { ...params, ativo: true }
      }
      await this.antesGetById(config)
      const registro = await this.modelo.findOne(config)
      await this.depoisGetById(registro)
      return defaultResponse(registro)
    } catch (error) {
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async create (dados) {
    const includes = []
    this._processarIncludes(dados, includes)
    try {
      const execAposCriar = await this._buscarReferencias(includes, dados)

      await this.antesCriar(dados)

      const objCriado = await this.modelo.create(dados, { include: includes })

      // varre as operações a serem executas, chamando os acessores set
      for (const key of Object.keys(execAposCriar)) {
        await objCriado[key](execAposCriar[key])
      }

      const result = await objCriado.reload()

      return defaultResponse(result, HttpStatus.CREATED)
    } catch (error) {
      return errorResponse(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async update (data, params) {
    try {
      const config = { where: params, ativo: true }
      await this.antesAtualizar(data, config)
      const registro = await this.modelo.findOne(config)
      if (!registro) return errorResponse(`Registro de código ${params.codigo} não encontrado`, HttpStatus.BAD_REQUEST)
      await this.modelo.update(data, { where: params })
      const registroNew = await registro.reload()
      await this.depoisAtualizar(registro, registroNew)
      return defaultResponse(registroNew)
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

  /**
   * Realiza processamentos no filtros detectando o que é filtro simples e filtro complexo
   * Filtros complexos são injetados nos includes e filtros simples são injetados no atributo where da classe principal
   * @param {object} filtros - filtros recebidos no parametro da requisição
   * @param {object} argsConsulta - argumentos de consulta
   * @param {Array} argsConsulta.include - includes da consulta
   * @param {object} argsConsulta.where - clausa where do modelo principal
   */
  _processarFiltros (filtros, argsConsulta) {
    const { include: includesConsulta, where: condicoesConsulta } = argsConsulta
    if (filtros?.length) {
      for (const filtro of filtros) {
        if (OPCOES_CONDICAO_BUSCA.indexOf(filtro.condicao) === -1) throw new Error('Condição não existe, favor verificar as opções.')
        if (!filtro.atributo) throw new Error('Obrigatório informar o nome do atributo.')
        if (filtro.atributo.split('.').length === 1) { // verifica se é um filtro simples, ou seja, dentro do proprio modelo
          condicoesConsulta[Sequelize.Op.and].push(this._getFiltroSimples(filtro))
          continue
        }

        this._processarFiltroComplexo(filtro, includesConsulta, this.modelo)
      }
    }

    if (!condicoesConsulta[Sequelize.Op.and].length) delete argsConsulta.where
  }

  /**
   * Método realiza um processamento em filtro complexo, onde é feito uma injeção da clausula (attributo) where
   * dentro do include referente aquele filtro. Ex.: filtro(cidade.uf.codigo = 1) -> é realizado uma varredura nos
   * includes até o include de uf, onde é adicionado a clausula where com o filtro passado.
   * @param {object} filtro - filtro passado na requisição
   * @param {array} includesConsulta - include configurado no controller da rota
   * @param {object} modelo - modelo relacionado ao filtro
   */
  _processarFiltroComplexo (filtro, includesConsulta, modelo) {
    const arFiltrosAttr = filtro.atributo.split('.')
    if (arFiltrosAttr.length) {
      const [attrAssociation, attribute] = arFiltrosAttr
      const modelAssociation = modelo.associations[attrAssociation]?.target
      if (!modelAssociation) throw new Error(`Modelo da associação ${attrAssociation} não encontrado`)

      const includeAssociotion = includesConsulta.find(el => el.association === attrAssociation)
      if (!includeAssociotion) throw new Error(`Associação ${attrAssociation} não encontrada`)

      includeAssociotion.required = true

      if (arFiltrosAttr.length === 2) {
        const result = includeAssociotion.where || { [Sequelize.Op.and]: [] }
        const filtroSimples = this._getFiltroSimples({
          atributo: attribute,
          valor: filtro.valor,
          condicao: filtro.condicao
        }, modelAssociation)

        result[Sequelize.Op.and].push(filtroSimples)

        includeAssociotion.where = result
        return
      }
      arFiltrosAttr.splice(0, 1)
      filtro.atributo = arFiltrosAttr.join('.')
      this._processarFiltroComplexo(filtro, includeAssociotion.include, modelAssociation)
    }
  }

  /**
   * Realiza a validação e montagem do filtro simples
   * @param {object} filtro - filtro passado na requisição
   * @param {object?} modelo - modelo relacionado ao filtro
   */
  _getFiltroSimples (filtro, modelo = this.modelo) {
    if (!modelo.tableAttributes[filtro.atributo]) throw new Error('Atributo não encontrado na classe.')
    return { ...CONDICAO_BUSCA[filtro.condicao](filtro) }
  }

  /**
   * Seta acessor set em objeto, definindo qual acessor deve ser chamado e o valor dele depois de criar o registro
   * @param {object} dados - objeto com o codigo da pk para fazer a vinculação no cadastro
   * @param {object} modeloAssociado - modelo da associação ou seja referente ao filho do json
   * @param {object} operacaoAposCriar - objeto que vai conter os metodos set acessores de cada include e os seus valores, que devem ser chamados apos a criação do registro
   */
  async _setOperacoesExecAposCriar (dados, modeloAssociado, operacaoAposCriar, isArray) {
    const { primaryKeyAttribute: attrPK } = modeloAssociado.target
    const { foreignKey: attrFK } = modeloAssociado
    const accessorsSet = modeloAssociado.accessors.set

    if (dados[attrPK] === 0) delete dados[attrPK]
    if (dados[attrFK] === 0) delete dados[attrFK]
    // eslint-disable-next-line no-prototype-builtins
    if (dados.hasOwnProperty(attrPK)) {
      const model = await modeloAssociado.target.findOne({ where: { [attrPK]: dados[attrPK], ativo: true } }).catch(err => { throw new Error(err) })
      if (model) {
        Array.isArray(operacaoAposCriar[accessorsSet])
          ? operacaoAposCriar[accessorsSet].push(dados[attrPK])
          : operacaoAposCriar[accessorsSet] = dados[attrPK]
      } else {
        throw new Error(`Registro (${attrPK}: ${dados[attrPK]}) não encontrado`)
      }
    }
  }

  /**
   * Realiza o processamento no corpo da requisição verificandos os includes e separando os metodos acessores que deve ser chamados apos a criação do registro, caso o objeto relacionado ao include tenha a chave primaria
   * @param {Array} includes - includes do body
   * @param {object} dados - body da requisicao
   */
  async _buscarReferencias (includes, dados) {
    const aposCriar = {}
    for (const { association } of includes) {
      const modeloAssociado = this.modelo.associations[association]
      const accessorsSet = modeloAssociado.accessors.set
      const obj = { [accessorsSet]: [] }

      if (Array.isArray(dados[association])) {
        for (const el of dados[association]) {
          await this._setOperacoesExecAposCriar(el, modeloAssociado, obj)
        }
      } else {
        obj[accessorsSet] = {}
        await this._setOperacoesExecAposCriar(dados[association], modeloAssociado, obj)
      }
      if (Array.isArray(obj[accessorsSet]) && !obj[accessorsSet]?.length) continue
      Object.assign(aposCriar, obj)
      delete dados[association]
    }
    return aposCriar
  }

  _processarIncludes (dados, includes) {
    Object.keys(dados).forEach(key => {
      if (dados[key] && typeof dados[key] === 'object') {
        const obj = { association: key, include: [] }
        includes.push(obj)

        this._processarIncludes(Array.isArray(dados[key])
          ? this._joinArrayToObject(dados[key])
          : dados[key], obj.include)

        if (!obj.include.length) delete obj.include
      }
    })
  }

  /**
   * Junta todos objetos de um array, em um unico objeto
   * @param {Array} dados - array de objetos que será transformado em um unico Object
   * @returns {Object}
   */
  _joinArrayToObject (dados) {
    const obj = {}
    dados.forEach(el => Object.assign(obj, el))
    return obj
  }

  // #region *** Hooks ***
  async antesCriar (dadosBody) {}
  async antesAtualizar (dadosBody, configConsulta) {}
  async antesGetAll (configConsulta) {}
  async antesGetOne (configConsulta) {}
  async antesGetById (configConsulta) {}
  async depoisCriar (registro) {}
  async depoisAtualizar (registroAnt, registroNew) {}
  async depoisGetAll (registros) {}
  async depoisGetById (registros) {}
  // #endregion
}
