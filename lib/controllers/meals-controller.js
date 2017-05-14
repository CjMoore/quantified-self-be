const Meal = require('../models/meal')

function create(request, response) {
  Meal.create(request.body).then( (data) => {
    response.json(data.rows[0])
  })
}

module.exports = {
  create: create
}
