import jwt from 'jwt-simple'
describe('Rotas de jogadores', () => {
  const Jogadores = app.datasource.models.Jogadores
  const Usuarios = app.datasource.models.Usuarios
  const jwtSecret = app.config.jwtSecret

  const defaultJogador = {
    id: 1,
    nome: 'DEFAULT JOGADOR',
    qtde_peladas: 2,
    avaliacao: 5
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
        Jogadores
          .destroy({
            where: {}
          })
          .then(() => Jogadores.create(defaultJogador))
          .then(() => {
            token = jwt.encode({
              id: usuario.id
            }, jwtSecret)
            done()
          })
      })

  })

  describe('Rota GET / Jogadores', () => {
    it('Deveria retornar a lista de jogadores', done => {
      request.get('/jogadores')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.body[0].id).to.be.eql(defaultJogador.id)
          expect(res.body[0].nome).to.be.eql(defaultJogador.nome)
          expect(res.body[0].qtde_peladas).to.be.eql(defaultJogador.qtde_peladas)
          expect(res.body[0].avaliacao).to.be.eql(defaultJogador.avaliacao)

          done(err)
        })
    })
  })

  describe('Rota GET /Jogadores/id', () => {
    it('Deveria retornar um jogador', done => {
      request.get('/jogadores/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.body.id).to.be.eql(defaultJogador.id)
          expect(res.body.nome).to.be.eql(defaultJogador.nome)
          expect(res.body.qtde_peladas).to.be.eql(defaultJogador.qtde_peladas)
          expect(res.body.avaliacao).to.be.eql(defaultJogador.avaliacao)

          done(err)
        })
    })
  })

  describe('Rota POST /Jogadores', () => {
    it('Deveria inserir um jogador', done => {

      const newJogador = {
        id: 2,
        nome: 'JOGADOR PADRAO',
        qtde_peladas: 2,
        avaliacao: 5
      }

      request.post('/jogadores')
        .set('Authorization', `Bearer ${token}`)
        .send(newJogador)
        .end((err, res) => {
          expect(res.body.id).to.be.eql(newJogador.id)
          expect(res.body.nome).to.be.eql(newJogador.nome)
          expect(res.body.qtde_peladas).to.be.eql(newJogador.qtde_peladas)
          expect(res.body.avaliacao).to.be.eql(newJogador.avaliacao)

          done(err)
        })
    })
  })

  describe('Rota PUT /Jogadores/id', () => {
    it('Deveria atualizar um jogador', done => {

      const updateJogador = {
        id: 1,
        nome: 'Jogador Atualizado'
      }

      request.put('/jogadores/1')
        .set('Authorization', `Bearer ${token}`)
        .send(updateJogador)
        .end((err, res) => {
          expect(res.body).to.be.eql([1])

          done(err)
        })
    })
  })

  describe('Rota DELETE /Jogadores/id', () => {
    it('Deveria deletar um jogador', done => {

      request.delete('/jogadores/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.be.eql(204)

          done(err)
        })
    })
  })
})