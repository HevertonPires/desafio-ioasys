
import Sequelize from 'sequelize'
const Op = Sequelize.Op

export const CONDICAO_BUSCA = {
  preenchido: (params) => { return { [params.atributo]: { [Op.not]: null } } },
  maiorOuIgual: (params) => { return { [params.atributo]: { [Op.gte]: params.valor } } },
  menorOuIgual: (params) => { return { [params.atributo]: { [Op.lte]: params.valor } } },
  maiorQue: (params) => { return { [params.atributo]: { [Op.gt]: params.valor } } },
  menorQue: (params) => { return { [params.atributo]: { [Op.lt]: params.valor } } },
  diferenteDe: (params) => { return { [params.atributo]: { [Op.not]: params.valor } } },
  igual: (params) => { return { [params.atributo]: { [Op.eq]: params.valor } } },
  iniciadoCom: (params) => { return { [params.atributo]: { [Op.startsWith]: params.valor } } },
  terminadoCom: (params) => { return { [params.atributo]: { [Op.endsWith]: params.valor } } },
  queContem: (params) => { return { [params.atributo]: { [Op.like]: '%' + params.valor + '%' } } },
  queNaoContem: (params) => { return { [params.atributo]: { [Op.notLike]: '%' + params.valor + '%' } } },
  vazio: (params) => { return { [params.atributo]: { [Op.eq]: null } } }
}

export const OPCOES_CONDICAO_BUSCA = [
  'preenchido',
  'maiorOuIgual',
  'menorOuIgual',
  'maiorQue',
  'menorQue',
  'diferenteDe',
  'igual',
  'iniciadoCom',
  'terminadoCom',
  'queContem',
  'queNaoContem',
  'vazio'
]
