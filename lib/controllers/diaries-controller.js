const Diary = require('../models/diary')

function create(request, response) {
  Diary.create(request.body).then( (data) => {
    response.json(data.rows[0])
  })
}

module.exports = {
  create: create
}
