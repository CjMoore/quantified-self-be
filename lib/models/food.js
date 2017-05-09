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

function updateFood(params, id) {

  database.raw('SELECT 1 FROM foods WHERE id=?', [id.toString()]).then( (data) => {
    // console.log(data.rowCount)
    if (data.rowCount == 1) {
      return database.raw('UPDATE foods SET name=?, calories=? WHERE id = ?', [params.name, params.calories, id.toString()])
    } else {
      // const notHere = {
      //   message: 'No Record'
      // }
      // return notHere
    }
  })

  // return database.raw(`IF EXISTS (SELECT * FROM Products WHERE id = ?) BEGIN (UPDATE foods SET name=?, calories=? WHERE id = ?) END ELSE BEGIN OUTPUT 0 END`, [id.toString(), params.name, params.calories, id.toString()])

}

function destroy(id) {
  return database.raw('DELETE FROM foods WHERE id = ?', [id])
}

module.exports = {
  all: all,
  find: find,
  createFood: createFood,
  updateFood: updateFood,
  destroy: destroy
}
