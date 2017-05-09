const Food = require('../models/food')

function index(request, response) {
  Food.all().then( (data) => {
    let foods = data.rows;

    if(foods == null) {
      response.sendStatus(404);
    } else {
      response.json(foods);
    }
  });
};

function show(request, response) {
  Food.find(request.params.id)
  .then( (data) => {
    let food = data.rows[0]

    if(food == null) {
      response.sendStatus(404);
    } else {
      response.json(food)
    }
  });
};

function create(request, response) {
  console.log(request.body)
  Food.createFood(request.body).then( (data) => {
    response.send(data)
  });
};

function update(request, response) {
  Food.update(request.body).then ( (data) => {
    response.send(data)
  });
};

function destroy(request, response) {
  Food.destroy(request.params.id).then( (data) => {
    response.json({ message: "Food successfully deleted"})
  })
}


module.exports = {
  index: index,
  show: show,
  create: create,
  update: update,
  destroy: destroy
}
