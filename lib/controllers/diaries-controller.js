const Diary = require('../models/diary')

function getData(request, response) {
  Diary.find(request.body).then( (data) => {
    response.json(data)
  })
}

module.exports = {
  getData: getData
}
