const environment   = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database      = require('knex')(configuration)

const pry = require('pryjs')

function create(params) {
  return database.raw('INSERT INTO diaries (date, created_at) VALUES(?,?) RETURNING *', [params.date, params.created_at ])
}

function find(params) {

  return database.raw('SELECT * FROM diaries WHERE date=?', [params.date]).then( (data) => {
    return findMeals(data.rows[0].id)
  });
}

function findMeals(diaryId) {
  return database.raw('SELECT meals.name AS meal, foods.name AS food, foods.calories AS calories FROM meals INNER JOIN foods ON meals.food_id=foods.id WHERE meals.diary_id=?', [diaryId]).then( (data) => {
    let meals = []
    data.rows.forEach( (mealFood) => {
      let mealObject = {}
      let foods = []
      if(meals.length <= 0) {
        mealObject['name'] = mealFood.meal
        mealObject['foods'] = addFood(mealFood, foods)
        meals.push(mealObject)
      } else {
        meals.forEach( (meal) => {
          if( meal.name == mealFood.meal ) {
            foods = meal.foods
            mealObject['foods'] = addFood(mealFood, foods)
          } else {
            mealObject['name'] = mealFood.meal
            mealObject['foods'] = addFood(mealFood, foods)
            meals.push(mealObject)
          }
        })
      }
    })
    return meals
  });
}

function addFood(mealFood, foods) {
  let foodsObj = {}
  foodsObj['name'] = mealFood.food
  foodsObj['calories'] = mealFood.calories
  foods.push(foodsObj)
  return foods
}


module.exports = {
  create: create,
  find: find
}
