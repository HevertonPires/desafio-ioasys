import Filmes from '../controllers/Filmes'
import Rota from './Rotas'

export default app => {
  Rota(app, 'filme', Filmes, 'Filmes')
}
