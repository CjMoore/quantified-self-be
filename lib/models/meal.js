const environment   = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database      = require('knex')(configuration)

function create(params) {
  return database.raw('INSERT INTO meals (name, diary_id, food_id, created_at) VALUES(?,?,?,?) RETURNING *', [params.name, params.diaryId, params.foodId, new Date])
}

module.exports = {
  create: create
}
