export default (app, rota, Controller, model, auth = true) => {
  app.route(`/${rota}`)
    .all(auth ? app.auth.authenticate() : () => true)
    .get((req, res) => {
      const controller = new Controller(app.datasource.models[model], req)
      controller.getAll()
        .then(response => {
          res.status(response.statusCode)
          res.json(response.data)
        })
        .catch(error => {
          res.status(400)
          res.json(error.data)
        })
    })
    .post((req, res) => {
      const controller = new Controller(app.datasource.models[model], req)
      controller.create(req.body)
        .then(response => {
          res.status(response.statusCode)
          res.json(response.data)
        })
        .catch(error => {
          res.status(400)
          res.json(error.data)
        })
    })
  app.route(`/${rota}/:codigo`)
    .all(auth ? app.auth.authenticate() : () => true)
    .get((req, res) => {
      const controller = new Controller(app.datasource.models[model], req)
      controller.getById(req.params)
        .then(response => {
          res.status(response.statusCode)
          res.json(response.data)
        })
        .catch(error => {
          res.status(400)
          res.json(error.data)
        })
    })
    .put((req, res) => {
      const controller = new Controller(app.datasource.models[model], req)
      controller.update(req.body, req.params)
        .then(response => {
          res.status(response.statusCode)
          res.json(response.data)
        })
        .catch(error => {
          res.status(400)
          res.json(error)
        })
    })
    .delete((req, res) => {
      const controller = new Controller(app.datasource.models[model], req)
      controller.delete(req.params)
        .then(response => {
          res.status(response.statusCode)
          res.json(response.data)
        })
        .catch(error => {
          res.status(400)
          res.json(error.data)
        })
    })
}
