const Meal = require('../models/meal')

function create(request, response) {
  Meal.create(request.body).then( (data) => {
    response.json(data.rows[0])
  })
}

function destroy(request, response) {
  Meal.destroy(request.params.id).then( (data) => {
    if(data.rowCount == 0){
      response.sendStatus(404)
    }
    else{
      response.json('Food Deleted from Meal')
    }
  })
}
module.exports = {
  create: create,
  destroy: destroy
}
