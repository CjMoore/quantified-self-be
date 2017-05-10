
exports.up = function(knex, Promise) {
  let createQuery = `CREATE TABLE meals(
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT,
    food_id INTEGER,
    diary_id INTEGER,
    created_at TIMESTAMP
  )`
  return knex.raw(createQuery)
};

exports.down = function(knex, Promise) {
  let dropQuery = `DROP TABLE meals`

  return knex.raw(dropQuery)
};
