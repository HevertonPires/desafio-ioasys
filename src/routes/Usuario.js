import Usuario from '../controllers/Usuarios'
import Rota from './Rotas'

export default app => {
  Rota(app, 'usuario', Usuario, 'Usuarios', false)
}
