import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

export default (app) => {
  const { Usuarios } = app.datasource.models
  const opts = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }

  const strategy = new Strategy(opts, (payload, done) => {
    Usuarios.findOne({ where: { codigo: payload.codigo, ativo: true } })
      .then((usuario) => {
        if (usuario) {
          return done(null, {
            codigo: usuario.codigo,
            email: usuario.email
          })
        }
        return done(null, false)
      })
      .catch((error) => done(error, null))
  })

  passport.use(strategy)

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', { session: false })
  }
}
