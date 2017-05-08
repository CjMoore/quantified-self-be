
exports.seed = function(knex, Promise) {
  return knex.raw(`TRUNCATE foods RESTART IDENTITY`).then(() => {
    return Promise.all([
      knex.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Banana', 34, new Date ]),
      knex.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Orange', 34, new Date ]),
      knex.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Dark Chocolate', 150, new Date ]),
      knex.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Beef Jerkey', 95, new Date ]),
    ])
  })

};
