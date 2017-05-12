
exports.seed = function(knex, Promise) {
  return knex.raw(`TRUNCATE diaries RESTART IDENTITY`).then(() => {
    return Promise.all([
      knex.raw('INSERT INTO diaries (date, created_at) VALUES(?,?)', [ "2017-05-09", new Date ]),
      knex.raw('INSERT INTO diaries (date, created_at) VALUES(?,?)', [ "2017-05-10", new Date ]),
      knex.raw('INSERT INTO diaries (date, created_at) VALUES(?,?)', [ "2017-05-11", new Date ]),
      knex.raw('INSERT INTO diaries (date, created_at) VALUES(?,?)', [ "2017-05-12", new Date ]
    ])
  })
};
