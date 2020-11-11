import 'dotenv/config'
import Express from 'express'
import BodyParser from 'body-parser'
import RouterManager from './routes/RouterManager'
import Config from './config/config'
import Authorization from './modules/auth'
import Cors from 'cors'
import { DATA_SOURCE } from './config/datasource'

const app = Express()

app.config = Config

// Inicia Modelos
app.datasource = DATA_SOURCE()

// Parse JSON
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))

// Permite acesso externo
app.use(Cors())

// Inicia Passport Js
const auth = Authorization(app)
app.use(auth.initialize())
app.auth = auth

app.use('/doc', Express.static('apidoc/'))

RouterManager(app)

export default app
