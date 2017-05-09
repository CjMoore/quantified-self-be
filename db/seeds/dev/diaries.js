
exports.seed = function(knex, Promise) {
  return knex.raw(`TRUNCATE diaries RESTART IDENTITY`).then(() => {
    return Promise.all([
      knex.raw('INSERT INTO diaries (date, created_at) VALUES(?,?)', [ new Date("9 May 2017"), new Date ]),
      knex.raw('INSERT INTO diaries (date, created_at) VALUES(?,?)', [ new Date("10 May 2017"), new Date ]),
      knex.raw('INSERT INTO diaries (date, created_at) VALUES(?,?)', [ new Date("11 May 2017"), new Date ]),
      knex.raw('INSERT INTO diaries (date, created_at) VALUES(?,?)', [ new Date("12 May 2017"), new Date ]),
    ])
  })
};
