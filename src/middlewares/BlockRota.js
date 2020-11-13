import httpStatus from 'http-status'
import jwt from 'jwt-simple'

export const BLOCK_ROTA = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }

  const authorization = req?.headers?.authorization?.replace('Bearer ', '')
  if (authorization) {
    const obj = jwt.decode(authorization, process.env.JWT_SECRET)
    req.userAdm = obj.admin
    req.userCodigo = obj.codigo

    if (req.path.includes('/filme', 0)) {
      if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') && !obj.admin) {
        return res.status(httpStatus.UNAUTHORIZED).json('Usuário não tem acesso a este recurso')
      }
    }
    if (req.path.includes('/admin', 0)) {
      if (['POST', 'GET', 'DELETE', 'PUT'].includes(req.method) && !obj.admin) {
        return res.status(httpStatus.UNAUTHORIZED).json('Usuário não tem acesso a este recurso')
      }
    }

    if (req.path.includes('/voto', 0)) {
      if (['POST', 'PUT'].includes(req.method) && obj.admin) {
        return res.status(httpStatus.UNAUTHORIZED).json('Administradores não podem votar')
      }
    }
  }
  next()
}
