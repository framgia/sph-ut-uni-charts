import request, { Response } from 'supertest'
import app from '../index'

describe('BFF Server Test Suite', () => {
  test('Test #1: Getting a failed response from server if routes does not exist.', (done) => {
    request(app)
      .get('/non-existing-route')
      .then((response: Response) => {
        expect(response.statusCode).toBe(404)
        done()
      })
  })

  test('Test #2: Getting a success response from /', (done) => {
    request(app)
      .get('/')
      .then((response: Response) => {
        expect(response.statusCode).toBe(200)
        done()
      })
  })
})
