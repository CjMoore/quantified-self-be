const assert = require('chai').assert;
const request = require('request')
const bodyParser = require('body-parser')
const app = require('../server');

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

        const food1 = 'bananas'
        const food2 = 'darkChocolate'
        const foodCalories1 = app.locals.foods["bananas"]
        const foodCalories2 = app.locals.foods["darkChocolate"]

        assert(response.body.includes(food1))
        assert(response.body.includes(food2))
        assert(response.body.includes(foodCalories1))
        assert(response.body.includes(foodCalories2))

        done();
      });
    });
  });

});
