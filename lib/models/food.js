const environment   = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database      = require('knex')(configuration)

function all() {
  return database.raw('SELECT * FROM foods')
}

function find(id) {
  return database.raw('SELECT * FROM foods WHERE id = ? LIMIT 1', [id])
}

function createFood(params) {
  return database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', [params.name, params.calories, params.created_at ])
}

function update(params) {
  database.raw(`UPDATE foods SET name=?, calories=? WHERE id = ? RETURN `, [params.name, params.calories, params.id.toString()])
}

function destroy(id) {
  return database.raw('DELETE FROM foods WHERE id = ?', [id])
}

module.exports = {
  all: all,
  find: find,
  createFood: createFood,
  update: update,
  destroy: destroy
}
