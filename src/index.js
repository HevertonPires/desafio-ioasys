import app from './app'

app.listen(process.env.APP_PORT, () => {
  console.log(`Estou no ar na porta ${process.env.APP_PORT}`)
})
