const express = require('express')
// const logger = require('morgan')
const bodyParser = require('body-parser')
const app = express()
const FoodsController = require('./lib/controllers/foods-controller')
const DiariesController = require('./lib/controllers/diaries-controller')
const MealsController = require('./lib/controllers/meals-controller')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.all('*',function(req,res,next)
{
    if (!req.get('Origin')) return next();

    res.set('Access-Control-Allow-Origin','*');
    res.set('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');
    res.set('Access-Control-Allow-Headers','X-Requested-With,Content-Type');

    if ('OPTIONS' == req.method) return res.send(200);

    next();
});

// app.use(logger('dev'))

app.set('port', process.env.PORT || 3000)

app.get('/api/v1/foods', FoodsController.index)

app.get('/api/v1/foods/:id', FoodsController.show)

app.post('/api/v1/foods', FoodsController.create)

app.patch('/api/v1/foods/:id', FoodsController.update)

app.delete('/api/v1/foods/:id', FoodsController.destroy)

app.post('/api/v1/diaries', DiariesController.create)

app.get('/api/v1/diaries/meals', DiariesController.getData)

app.post('/api/v1/meals', MealsController.create)


if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app;
