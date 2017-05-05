const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json());
app.use(logger('dev'))

app.set('port', process.env.PORT || 3000)

// if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
// }
