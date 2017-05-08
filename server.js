const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json());
app.use(logger('dev'))

app.set('port', process.env.PORT || 3000)

app.locals.foods = {
  bananas: 34,
  darkChocolate: 150
}

app.get('/api/v1/foods', (request, response) => {
  const foods = app.locals.foods

  response.json({foods})
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app;
