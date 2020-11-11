import fs from 'fs'
import path from 'path'

export default app => {
  fs.readdirSync(path.join(__dirname, './')).forEach(fileName => {
    if (fileName !== 'RouterManager.js' && fileName !== 'Rotas.js') {
      import(path.join(__dirname, fileName))
        .then(modulo => modulo.default(app))
        .catch(err => console.error(err))
    }
  })
}
