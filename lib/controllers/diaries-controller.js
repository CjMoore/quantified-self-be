const Diary = require('../models/diary')

function create(request, response) {
  Diary.create(request.body).then( (data) => {
    response.json(data.rows[0])
  })
}

function getData(request, response) {
  Diary.find(request.body).then( (data) => {
    response.json(data)
  })
}

module.exports = {
  create: create,
  getData: getData
}
