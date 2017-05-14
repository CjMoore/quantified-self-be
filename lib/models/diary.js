const environment   = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database      = require('knex')(configuration)


function create(params) {
  return database.raw('INSERT INTO diaries (date, created_at) VALUES(?,?) RETURNING *', [params.date, new Date ]).then( (data ) => {
    return data.rows[0]
  })
}

function find(params) {
  return database.raw('SELECT * FROM diaries WHERE date=?', [params.date]).then( (data) => {
    if (data.rows[0] == undefined) {
      return create(params)
    } else {
      return findMeals(data.rows[0].id)
    }
  });
}

function findMeals(diaryId) {
  return database.raw('SELECT meals.name AS meal, foods.name AS food, foods.calories AS calories FROM meals INNER JOIN foods ON meals.food_id=foods.id WHERE meals.diary_id=?', [diaryId]).then( (data) => {
    let meals = []
    data.rows.forEach( (mealFood) => {
      if (!meals.includes(mealFood.meal)) {meals.push(mealFood.meal)}
    })
    meals.forEach( (mealName, index) => {
      meals[index] = {name: mealName, foods: []}
      data.rows.forEach( (mealFood) => {
        if (mealFood.meal == mealName){
          meals[index].foods.push({name: mealFood.food, calories: mealFood.calories})
        }
      })
    })
    return meals
  });
}


module.exports = {
  create: create,
  find: find
}
