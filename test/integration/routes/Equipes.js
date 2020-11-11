import jwt from 'jwt-simple'
describe('Rotas de equipes', () => {
  const Equipes = app.datasource.models.Equipes
  const Usuarios = app.datasource.models.Usuarios
  const jwtSecret = app.config.jwtSecret

  const defaultEquipe = {
    id: 1,
    descricao: 'DEFAULT EQUIPE',
  }

  let token

  beforeEach(done => {
    Usuarios
      .destroy({
        where: {}
      })
      .then(() => Usuarios.create({
        nome: 'Teste',
        login: 'teste@teste.com',
        senha: '1234'
      }))
      .then((usuario) => {
        Equipes
          .destroy({
            where: {}
          })
          .then(() => Equipes.create(defaultEquipe))
          .then(() => {
            token = jwt.encode({
              id: usuario.id
            }, jwtSecret)
            done()
          })
      })

  })

  describe('Rota GET / Equipes', () => {
    it('Deveria retornar a lista de equipes', done => {
      request.get('/equipes')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.body[0].id).to.be.eql(defaultEquipe.id)
          expect(res.body[0].descricao).to.be.eql(defaultEquipe.descricao)
         
          done(err)
        })
    })
  })

  describe('Rota GET /Equipes/id', () => {
    it('Deveria retornar um equipe', done => {
      request.get('/equipes/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.body.id).to.be.eql(defaultEquipe.id)
          expect(res.body.descricao).to.be.eql(defaultEquipe.descricao)
          
          done(err)
        })
    })
  })

  describe('Rota POST /Equipes', () => {
    it('Deveria inserir um equipe', done => {

      const newEquipe = {
        id: 2,
        descricao: 'EQUIPE PADRAO',
      }

      request.post('/equipes')
        .set('Authorization', `Bearer ${token}`)
        .send(newEquipe)
        .end((err, res) => {
          expect(res.body.id).to.be.eql(newEquipe.id)
          expect(res.body.descricao).to.be.eql(newEquipe.descricao)
          
          done(err)
        })
    })
  })

  describe('Rota PUT /Equipes/id', () => {
    it('Deveria atualizar um equipe', done => {

      const updateEquipe = {
        id: 1,
        descricao: 'Equipe Atualizada'
      }

      request.put('/equipes/1')
        .set('Authorization', `Bearer ${token}`)
        .send(updateEquipe)
        .end((err, res) => {
          expect(res.body).to.be.eql([1])

          done(err)
        })
    })
  })

  describe('Rota DELETE /Equipes/id', () => {
    it('Deveria deletar um equipe', done => {

      request.delete('/equipes/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.be.eql(204)

          done(err)
        })
    })
  })
})