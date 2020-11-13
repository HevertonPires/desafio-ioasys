import Genero from '../controllers/Generos'
import Rota from './Rotas'

export default app => {
  Rota(app, 'genero', Genero, 'Generos')
}
