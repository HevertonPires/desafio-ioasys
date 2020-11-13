import Ator from '../controllers/Atores'
import Rota from './Rotas'

export default app => {
  Rota(app, 'ator', Ator, 'Atores')
}
