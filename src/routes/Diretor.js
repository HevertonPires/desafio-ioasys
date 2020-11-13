import Diretor from '../controllers/Diretores'
import Rota from './Rotas'

export default app => {
  Rota(app, 'diretor', Diretor, 'Diretores')
}
