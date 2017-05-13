
exports.seed = function(knex, Promise) {
  return knex.raw(`TRUNCATE meals RESTART IDENTITY`).then(() => {
    return Promise.all([
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Breakfast", 1, 1, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Lunch", 3, 1, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Dinner", 2, 1, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Snacks", 1, 1, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Breakfast", 3, 2, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Lunch",4, 2, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Dinner", 1, 3, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Dinner", 3, 5, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Dinner", 2, 5, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Beakfast", 1, 5, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Snacks", 4, 5, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Snacks", 1, 4, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Lunch", 2, 6, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Lunch", 3, 5, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Breakfast", 4, 4, new Date ]),
      knex.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES(?,?,?,?)', ["Breakfast", 2, 6, new Date ]),

    ])
  })
};
