import UsuariosController from '../controllers/Usuarios'

export default (app) => {
  app.post('/login', async (req, res) => {
    const controller = await new UsuariosController(app.datasource.models.Usuarios, req)
    await controller.autenticar(req, res)
  })
}
