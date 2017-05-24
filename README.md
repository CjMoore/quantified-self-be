# quantified-self-be
 <p>This project is a backend API which functions with a separate front-end to track meals, foods, and calories in a food diary. The API is written in JS utilizing Node.js/Express frameworks. It uses a postgres database with a knex ORM. This is a student project done in Module 4 of the Back End Engineering program at the Turing School of Software and Design.</p>
This API lives at `https://qs-be.herokuapp.com/api/v1`


## Initial Setup/Installation

 * To get started, clone this repository.
 * Within project directory, run `npm install`
 * Create databases in postgres console, 'quantified_self' and 'quantified_self_test'
 * run `knex run migrate:latest` ##perform database migrations
 * run `knex seed:run` ##seed database with sample data
 * To start server locally, `npm start`
 
## Running Test Suite

 * Following initial setup, run `npm test` ##Runs test suite

## Endpoints:

  * 'GET' /foods - Returns all foods in db
  * 'GET' /foods/:id - Returns a single food that corresponds to the given id
  * 'POST' /foods - Allows you to post a new food to the db, requires that you include the name and calories. 
  * 'DELETE' /foods/:id - Changes the status of a food from active to inactive
  * 'PATCH' /foods/:id - Allows you to edit the name or calories of a particular food.
  * 'GET' /diaries/meals - Returns all the meals with their associated foods for a particular diary date. Must pass date through as params.
  * 'POST' /meals - Allows user to post a new meal, must include food and diary ids. 
  * 'DELETE' /meals/:id - Allows a user to delete a meal. 
  * 'GET' /search - Querries the db for records that match data recieved from request. 
  
Schema

![Schema](quantified-self-be/Screen Shot 2017-05-10 at 4.55.00 PM.png)
