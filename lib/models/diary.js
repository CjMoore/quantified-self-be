const environment   = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database      = require('knex')(configuration)

function create(params) {
  console.log(params)
  return database.raw('INSERT INTO diaries (date, created_at) VALUES(?,?) RETURNING *', [params.date, params.created_at ])
}

module.exports = {
  create: create
}
