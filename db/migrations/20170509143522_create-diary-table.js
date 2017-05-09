
exports.up = function(knex, Promise) {
  let createQuery = `CREATE TABLE diaries(
    id SERIAL PRIMARY KEY NOT NULL,
    date DATE,
    created_at TIMESTAMP
  )`
  return knex.raw(createQuery)
};

exports.down = function(knex, Promise) {
  let dropQuery = `DROP TABLE diaries`

  return knex.raw(dropQuery)
};
