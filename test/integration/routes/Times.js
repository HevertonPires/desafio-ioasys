import jwt from 'jwt-simple'

describe('Rota de times', () => {
  let token
  const Jogadores = app.datasource.models.Jogadores
  const Usuarios = app.datasource.models.Usuarios
  const Peladas = app.datasource.models.Peladas
  const Equipes = app.datasource.models.Equipes
  const Times = app.datasource.models.Times
  const jwtSecret = app.config.jwtSecret

  const defaultJogador = {
    id: 1,
    nome: 'DEFAULT JOGADOR',
    qtde_peladas: 2,
    avaliacao: 5
  }

  const defaultPelada = {
    id: 1,
    descricao: 'DEFAULT PELADA',
    data: new Date().toJSON(),
    local: 'Local Padrão'
  }

  const defaultEquipe = {
    id: 1,
    descricao: 'DEFAULT EQUIPE',
  }

  const defaultTime = {
    id: 1,
    jogador: defaultJogador.id,
    equipe: defaultEquipe.id,
    pelada: defaultPelada.id
  }

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
        Times.destroy({
            where: {}
          })
          .then(() => {
            Jogadores.destroy({
                where: {}
              })
              .then(() => Jogadores.create(defaultJogador))
            Peladas.destroy({
                where: {}
              })
              .then(() => Peladas.create(defaultPelada))
            Equipes.destroy({
                where: {}
              })
              .then(() => Equipes.create(defaultEquipe))
              .then(() => Times.create(defaultTime))
              .then(() => {
                token = jwt.encode({
                  id: usuario.id
                }, jwtSecret)
                done()
              })
          })

      })
  })

  describe('ROTA GET / Times', () => {
    it('Deveria retornar uma lista de times', done => {
      request.get('/times')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.body[0].id).to.be.eql(defaultTime.id)
          expect(res.body[0].jogador).to.be.eql(defaultTime.jogador)
          expect(res.body[0].equipe).to.be.eql(defaultTime.equipe)
          expect(res.body[0].pelada).to.be.eql(defaultTime.pelada)

          done(err)
        })

    })
  })

  describe('ROTA GET / Times/id', () => {
    it('Deveria retornar um time', done => {
      request.get('/times/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.body.id).to.be.eql(defaultTime.id)
          expect(res.body.jogador).to.be.eql(defaultTime.jogador)
          expect(res.body.equipe).to.be.eql(defaultTime.equipe)
          expect(res.body.pelada).to.be.eql(defaultTime.pelada)

          done(err)
        })

    })
  })

  describe('ROTA POST / Times', () => {
    it('Deveria inserir um time', done => {

      const newTime = {
        id: 2,
        jogador: defaultJogador.id,
        pelada: defaultPelada.id,
        equipe: defaultEquipe.id
      }

      request.post('/times')
        .set('Authorization', `Bearer ${token}`)
        .send(newTime)
        .end((err, res) => {
          expect(res.body.id).to.be.eql(newTime.id)
          expect(res.body.jogador).to.be.eql(newTime.jogador)
          expect(res.body.equipe).to.be.eql(newTime.equipe)
          expect(res.body.pelada).to.be.eql(newTime.pelada)

          done(err)
        })

    })
  })

  describe('ROTA PUT / Times/id', () => {
    it('Deveria atualizar um time', done => {

      const updateTime = {
        id: 1
      }

      Equipes.create({
          id: 2,
          descricao: 'EQUIPE 2'
        })
        .then(equipe => {
          updateTime['equipe'] = equipe
        })

      request.put('/times/1')
        .set('Authorization', `Bearer ${token}`)
        .send(updateTime)
        .end((err, res) => {
          expect(res.body).to.be.eql([1])

          done(err)
        })

    })
  })

  describe('Rota DELETE /Times/id', () => {
    it('Deveria deletar um time', done => {

      request.delete('/times/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.be.eql(204)

          done(err)
        })
    })
  })
})