import UsuariosController from '../controllers/Usuarios'

export default (app) => {
  const controller = new UsuariosController(app.datasource.models.Usuarios)

  app.post('/login', controller.autenticar)
}
