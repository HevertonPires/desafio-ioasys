import jwt from 'jwt-simple'
describe('Rotas de peladas', () => {
  const Peladas = app.datasource.models.Peladas
  const Usuarios = app.datasource.models.Usuarios
  const jwtSecret = app.config.jwtSecret

  const defaultPelada = {
    id: 1,
    descricao: 'DEFAULT PELADA',
    data: new Date().toJSON(),
    local: 'Local Padrão'
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
        Peladas
          .destroy({
            where: {}
          })
          .then(() => Peladas.create(defaultPelada))
          .then(() => {
            token = jwt.encode({
              id: usuario.id
            }, jwtSecret)
            done()
          })
      })

  })

  describe('Rota GET / Peladas', () => {
    it('Deveria retornar a lista de peladas', done => {
      request.get('/peladas')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.body[0].id).to.be.eql(defaultPelada.id)
          expect(res.body[0].descricao).to.be.eql(defaultPelada.descricao)
          expect(res.body[0].data).to.be.eql(defaultPelada.data)
          expect(res.body[0].local).to.be.eql(defaultPelada.local)

          done(err)
        })
    })
  })

  describe('Rota GET /Peladas/id', () => {
    it('Deveria retornar um pelada', done => {
      request.get('/peladas/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.body.id).to.be.eql(defaultPelada.id)
          expect(res.body.descricao).to.be.eql(defaultPelada.descricao)
          expect(res.body.data).to.be.eql(defaultPelada.data)
          expect(res.body.local).to.be.eql(defaultPelada.local)

          done(err)
        })
    })
  })

  describe('Rota POST /Peladas', () => {
    it('Deveria inserir um pelada', done => {

      const newPelada = {
        id: 2,
        descricao: 'PELADA PADRAO',
        data: new Date().toJSON(),
        local: 'Local Padrão 2'
      }

      request.post('/peladas')
        .set('Authorization', `Bearer ${token}`)
        .send(newPelada)
        .end((err, res) => {
          expect(res.body.id).to.be.eql(newPelada.id)
          expect(res.body.descricao).to.be.eql(newPelada.descricao)
          expect(res.body.data).to.be.eql(newPelada.data)
          expect(res.body.local).to.be.eql(newPelada.local)

          done(err)
        })
    })
  })

  describe('Rota PUT /Peladas/id', () => {
    it('Deveria atualizar um pelada', done => {

      const updatePelada = {
        id: 1,
        descricao: 'Pelada Atualizada'
      }

      request.put('/peladas/1')
        .set('Authorization', `Bearer ${token}`)
        .send(updatePelada)
        .end((err, res) => {
          expect(res.body).to.be.eql([1])

          done(err)
        })
    })
  })

  describe('Rota DELETE /Peladas/id', () => {
    it('Deveria deletar um pelada', done => {

      request.delete('/peladas/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.be.eql(204)

          done(err)
        })
    })
  })
})