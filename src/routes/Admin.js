import Usuario from '../controllers/Usuarios'
import Rota from './Rotas'

export default app => {
  Rota(app, 'admin', Usuario, 'Usuarios')
}
