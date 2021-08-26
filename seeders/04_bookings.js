module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(1, 2000).map((value, index) => ({
      user_id: 1 + parseInt(Math.random() * 1999),
      cab_id: 1 + parseInt(Math.random() * 1999),
      starting_point: 1 + parseInt(Math.random() * 1999),
      destination: 1 + parseInt(Math.random() * 1999),
      status: faker.commerce.color()
    }));
    return queryInterface.bulkInsert('bookings', arr, {})
  },
  down: queryInterface => queryInterface.bulkDelete('bookings', null, {})
}