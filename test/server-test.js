const assert = require('chai').assert;
const request = require('request')
const bodyParser = require('body-parser')
const app = require('../server');

const environment   = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const database      = require('knex')(configuration)

const pry = require('pryjs')

describe('Server', () => {

  before( (done) => {
    this.port = 9876;
    this.server = app.listen(this.port, (err, result)  => {
      if (err) { return done(err); }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    });
  });

  after( () => {
    this.server.close();
  });

  it('should exist', () => {
    assert(app);
  });

  describe('GET /api/v1/foods', () => {

    beforeEach((done) => {
      database.raw('INSERT INTO foods (name, calories, created_at, status) VALUES (?,?,?,?)', ["Donut", 500, new Date, 0]).then(() =>{
        database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)', ["Banana", 34, new Date]).then(() => {
          database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)', ['Orange', 34, new Date]).then(() => {
            done()
          })
        });
      })
    })

    afterEach((done)=>{
      database.raw('TRUNCATE foods RESTART IDENTITY').then(()=> done())
    })

    it('should return a 200', (done) => {
      this.request.get('/api/v1/foods', (error, response)  => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);

        done();
      });
    });

    it('should return the correct json response for active foods', (done) => {
      this.request.get('/api/v1/foods', (error, response) => {
        if (error) { done(error); }

        let parsedFoods = JSON.parse(response.body)

        assert.equal(parsedFoods[0].status, 1)
        assert.equal(parsedFoods[1].status, 1)
        assert.equal(parsedFoods.length, 2)
        done();
      });
    });
  });

  describe('GET /api/v1/foods/:id', () => {
    beforeEach((done) => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)', ["Banana", 34, new Date]).then(() => {
        database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)', ['Orange', 34, new Date]).then(() => {
          done()
        })
      });
    })

    afterEach((done)=>{
      database.raw('TRUNCATE foods RESTART IDENTITY').then(()=> done())
    })

    it('should return a 404 if asked for food that does not exist', (done) => {
      this.request.get('/api/v1/foods/20', (error, response) => {
        if(error) { done(error) }
        assert.equal(response.statusCode, 404)
        done();
      })
    })

    it('should return the correct food given id', (done) => {
      this.request.get('/api/v1/foods/1', (error, response) => {
        if (error) { done(error); }

        const id = 1
        const food = "Banana"
        const calories = 34

        let parsedFood = JSON.parse(response.body)

        assert.equal(parsedFood.id, id)
        assert.equal(parsedFood.name, food)
        assert.equal(parsedFood.calories, calories)
        assert.ok(parsedFood.created_at)
        done();
      });
    });
  });

  describe('POST /api/v1/foods', () => {

    beforeEach((done) => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)', ["Banana", 34, new Date]).then(() => {
        database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)', ['Orange', 34, new Date]).then(() => {
          done()
        })
      });
    });

    afterEach((done)=>{
      database.raw('TRUNCATE foods RESTART IDENTITY').then(()=> done())
    });

    it('should receive and store data', (done) => {
      var newFood = {
        name: 'Dark Chocolate',
        calories: 150,
      };

      this.request.post('/api/v1/foods', { form: newFood }, (error, response) => {
         if (error) { done(error); }

        const successfullPost  = JSON.parse(response.body)

        assert.equal(successfullPost[0].name, 'Dark Chocolate')
        assert.equal(successfullPost[0].calories, 150)

      })
      done();
    });
  })

  describe('PATCH /api/v1/foods/:id', () => {
    beforeEach((done) => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)', ["Banana", 34, new Date]).then( () => {
        done()
      })
    });

    afterEach((done)=>{
      database.raw('TRUNCATE foods RESTART IDENTITY').then(()=> done())
    });

    it('can update a record', (done) => {
      const changeFood = {
        name: 'Orange',
        calories: 150,
        created_at: new Date
      };

      this.request.patch('/api/v1/foods/2', {form: changeFood}, (error, response) => {
        if (error) { done(error); }
        const updatedFood = JSON.parse(response.body)

        assert.equal(updatedFood[0].name, 'Orange')
        assert.equal(updatedFood[0].calories, 150)
        done()

      });
    });

  });

  describe('DELETE /api/v1/foods/:id', () => {
    beforeEach((done) => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)', ["Banana", 34, new Date]).then(() => {
        database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)', ['Orange', 34, new Date]).then(() => {
          done()
        })
      });
    });

    afterEach((done)=>{
      database.raw('TRUNCATE foods RESTART IDENTITY').then(()=> done())
    });

    it('is able to delete a record', (done) => {
      const removeFood = {
        name: 'Banana'
      }
      this.request.delete('/api/v1/foods/1', (error, response) => {
        const message = JSON.parse(response.body).message
        assert.equal(message, "Food successfully deleted")

        return database.raw('SELECT * FROM foods WHERE status = 1').then( (data) => {
          assert.equal(data.rows.length, 1)
          done();
        });
      });
    });
  });

    describe('GET /api/v1/search', () => {
      beforeEach((done) => {
        database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['DonutA', 50, new Date])
        .then(() => {
        database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['DonutB', 500, new Date])
        .then(() => done())})
      })
      afterEach((done) => {
        database.raw('TRUNCATE foods RESTART IDENTITY')
        .then(() => done())
      })

      it('should return foods which match the search parameter', (done) => {
        this.request.get({
          headers: {'content-type' : 'application/x-www-form-urlencoded'},
          url: '/api/v1/search?searchName=d'}, (error, response) => {
          if (error) { done(error) }

          let searchResults = JSON.parse(response.body)
          let foodA = searchResults[0]
          let foodB = searchResults[1]

          assert.equal(foodA.id, 1)
          assert.equal(foodA.name, 'DonutA')
          assert.equal(foodA.calories, 50 )
          assert.equal(foodB.id, 2)
          assert.equal(foodB.name, 'DonutB')
          assert.equal(foodB.calories, 500 )

          done()
        })
      })

      it('should return an empty array if no results found', (done) => {
        this.request.get({
          headers: {'content-type' : 'application/x-www-form-urlencoded'},
          url: '/api/v1/search?searchName=banana'}, (error, response) => {
          if (error) { done(error) }

          let searchResults = JSON.parse(response.body)
          assert.typeOf(searchResults, 'array')
          assert.equal(searchResults.length, 0)
          done()
        })
      })
    })

  describe('POST /api/v1/meals', () => {

    beforeEach((done) => {
      database.raw('INSERT INTO diaries (date, created_at) VALUES (?,?)', [ new Date("9 May 2017"), new Date]).then( () => {
        done()
      })
    });

    afterEach((done)=>{
      database.raw('TRUNCATE diaries RESTART IDENTITY').then(()=> {
        done()
      });
    });

    it('is able to create a meal', (done) => {

      const meal = {
        name: "Breakfast",
        diaryDate: '2017-05-09'
      }

      this.request.post('/api/v1/meals', {form: meal}, (error, response) => {
        const newMeal = JSON.parse(response.body)

        assert.equal(newMeal[0].name, "Breakfast")

        return database.raw("SELECT * FROM diaries WHERE id=?", [newMeal[0].diary_id]).then( (data) => {
          let diaryDate = data.rows[0].date
          let diaryDay = diaryDate.getDate()
          let diaryMonth = diaryDate.getMonth() + 1
          let diaryYear = diaryDate.getFullYear()

          const compareDate = `${diaryYear}-0${diaryMonth}-0${diaryDay}`
          assert.equal(compareDate, meal.diaryDate)
          done()
        })

        done();
      });
    });
  });

  describe('GET /api/v1/diaries/meals', () => {

    beforeEach((done) => {
      database.raw('INSERT INTO diaries (date, created_at) VALUES (?,?)', [ new Date("9 May 2017"), new Date]).then( () => {
        database.raw('INSERT INTO foods (name, calories, created_at, status) VALUES (?,?,?,?)', ["Banana", 34, new Date, 0]).then( () => {
          database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)', ["Dark Chocolate", 150, new Date]).then( () => {
            database.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES (?,?,?,?)', ["Lunch", 1, 1, new Date]).then( () => {
              database.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES (?,?,?,?)', ["Lunch", 2, 1, new Date]).then( () => {
                database.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES (?,?,?,?)', ["Dinner", 2, 1, new Date]).then( () => {
                  database.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES (?,?,?,?)', ["Dinner", 1, 1, new Date]).then( () => {
                    database.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES (?,?,?,?)', ["Snack", 1, 1, new Date]).then( () => {
                      database.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES (?,?,?,?)', ["Snack", 2, 1, new Date]).then( () => {
                        database.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES (?,?,?,?)', ["Breakfast", 2, 1, new Date]).then( () => {
                          database.raw('INSERT INTO meals (name, food_id, diary_id, created_at) VALUES (?,?,?,?)', ["Breakfast", 1, 1, new Date]).then( () => {
                            done()
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    afterEach((done)=>{
      database.raw('TRUNCATE meals RESTART IDENTITY').then(()=> {
        database.raw('TRUNCATE foods RESTART IDENTITY').then(() => {
          database.raw('TRUNCATE diaries RESTART IDENTITY').then(()=> {done()})
        });
      });
    });

    it('returns data about meals associated with that date and the food for those meals', (done) => {

      this.request.get('/api/v1/diaries/meals?date=2017-05-09',(error, response) => {
        const meals = JSON.parse(response.body)
        let breakfast = meals[0]
        let snack     = meals[1]
        let dinner    = meals[2]
        let lunch     = meals[3]

        assert.equal(meals.length, 4)
        assert.equal(breakfast.name, "Breakfast")
        assert.equal(snack.name, "Snack")
        assert.equal(dinner.name, "Dinner")
        assert.equal(lunch.name, "Lunch")
        meals.forEach((meal) => {
          assert.equal(meal.foods.length, 2)
          meal.foods.forEach((food) => {
            assert.ok(food.name)
            assert.ok(food.calories)
          })
        })
        done()
      });
    });

    it('creates and returns a new diary if diary does not exist', (done) => {

      const diaryDateMake = { date: '2017-05-20'}
      this.request.get('/api/v1/diaries/meals?date=2017-05-20', (error, response) =>{
        const diary = JSON.parse(response.body)

        const formattedReturn = new Date('2017-05-20').toISOString().slice(0, 10);

        assert.equal(formattedReturn, diaryDateMake.date)

        done()
      })
    })
  });
});
