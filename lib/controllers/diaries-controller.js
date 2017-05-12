const Diary = require('../models/diary')

function getData(request, response) {
  Diary.find(request.query).then( (data) => {
    response.json(data)
  })
}

module.exports = {
  getData: getData
}
