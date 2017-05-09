const environment   = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database      = require('knex')(configuration)

function create(params) {
  return database.raw('SELECT * FROM diaries WHERE date = ? LIMIT 1', [params.diaryDate]).then( (data) => {
    return database.raw('INSERT INTO meals (name, diary_id, created_at) VALUES(?,?,?) RETURNING *', [params.name, data.rows[0].id, new Date ]).then( (data) => {
      return data.rows
    })
  })
}

module.exports = {
  create: create
}
