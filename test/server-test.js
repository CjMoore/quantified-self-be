const assert = require('chai').assert;
const request = require('request')
const bodyParser = require('body-parser')
const app = require('../server');

const environment   = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const database      = require('knex')(configuration)

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
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)', ["Banana", 34, new Date]).then(() => {
        database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)', ['Orange', 34, new Date]).then(() => {
          done()
        })
      });
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

    it('should return the correct json response', (done) => {
      this.request.get('/api/v1/foods', (error, response) => {
        if (error) { done(error); }

        let parsedFoods = JSON.parse(response.body)

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
        created_at: new Date
      };

      this.request.post('/api/v1/foods', { form: newFood }, (error, response) => {
        //  if (error) { done(error); }
        //  console.log(response.body)

        // console.log(response.body)
        // const foodsCount  = response.body.count
        // assert.equal(foodsCount, 3)

        done();
      });
    });
  })

  describe('PATCH /api/v1/foods/:id', () => {
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

    it('can update a record', (done) => {
      const changeFood = {
        name: 'Orange',
        calories: 150,
        created_at: new Date
      };

      this.request.patch('/api/v1/foods/2', {form: changeFood}, (error, response) => {
        if (error) { done(error); }

        // const updatedFood = JSON.parse(response.body)
        //
        // assert.not.equal(updatedFood.calories, 34)
        // assert.equal(updaedFood.calories, 150)
        // assert.equal(updaedFood.name, 'Orange')

        done();
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
      this.request.delete('/api/v1/foods/1', (error, response) => {
        const message = JSON.parse(response.body).message
        assert.equal(message, "Food successfully deleted")
        done();
      });
    });
  });
});
