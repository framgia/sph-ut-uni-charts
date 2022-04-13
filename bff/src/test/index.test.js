const request = require('supertest')
const app = require('../index')

describe('BFF Server Test Suite', () => {
  test('Test #1: Getting a response from /', (done) => {
    request(app)
      .get('/')
      .then((response) => {
        expect(response.statusCode).toBe(200)
        done()
      })
  })
})
