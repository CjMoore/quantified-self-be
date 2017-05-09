const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const app = express()
const FoodsController = require('./lib/controllers/foods-controller')

app.use(bodyParser.json());

app.use(logger('dev'))

app.set('port', process.env.PORT || 3000)

app.get('/api/v1/foods', FoodsController.index)

app.get('/api/v1/foods/:id', FoodsController.show)

app.post('/api/v1/foods', (request, response) => {
  console.log(request.body)
})

app.patch('/api/v1/foods/:id', (request, response) => {
  console.log(request.body)
})

app.delete('/api/v1/foods/:id', FoodsController.destroy)

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app;
