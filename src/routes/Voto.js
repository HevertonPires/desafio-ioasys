import Votos from '../controllers/Votos'
import Rota from './Rotas'

export default app => {
  Rota(app, 'voto', Votos, 'Votos')
}
