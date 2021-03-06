const environment   = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database      = require('knex')(configuration)

function all() {
  return database.raw('SELECT * FROM foods WHERE status = 1')
}

function find(id) {
  return database.raw('SELECT * FROM foods WHERE id = ? LIMIT 1', [id])
}

function createFood(params) {
  return database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?) RETURNING *', [params.name, params.calories, new Date ])
}

function updateFood(params, id) {
  return database.raw('UPDATE foods SET name=?, calories=? WHERE id = ? RETURNING *', [params.name, params.calories, id]).then( (data) => {
    return data.rows
  });

}

function destroy(id) {
  return database.raw('UPDATE foods SET status = 0 WHERE id = ?', [id])
}

function search (searchName){
  var searchParam = searchName + '%'
  return database('foods').returning(['id', 'name', 'calories']).where('name', 'ilike', searchParam ).where('status', '=', 1)
  .catch(function(error){
    return []
  })
}

module.exports = {
  all: all,
  find: find,
  createFood: createFood,
  updateFood: updateFood,
  destroy: destroy,
  search: search
}
