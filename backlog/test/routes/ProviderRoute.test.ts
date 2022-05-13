import request from 'supertest'
import express from 'express'

import ProviderRoute from '../../routes/ProviderRoute'
const Provider = require('../../models/Provider')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', ProviderRoute)

describe('When accessing /providers/:id route', () => {
  describe('if ID exists', () => {
    const mockedResponse = {
      id: 1,
      user_id: 1,
      name: 'provider-1',
      space_key: 'space-key-1',
      api_key: 'api-key-1',
      created_at: '2022-05-12T05:42:35.945Z',
      updated_at: '2022-05-12T05:42:35.946Z',
      projects: []
    }

    beforeEach(() => {
      jest.spyOn(Provider.prototype, 'getProviderById').mockImplementationOnce(() => mockedResponse)
    })
    it('should return a status of 200', async () => {
      const response = await request(app).get(`/1111`)

      expect(response.statusCode).toBe(200)
    })

    it('should return the expected error message', async () => {
      const response = await request(app).get(`/1111`)
      const parsedResponse = JSON.parse(response.text)

      expect(parsedResponse).toMatchObject(mockedResponse)
    })
  })

  describe('if ID does not exist', () => {
    beforeEach(() => {
      jest.spyOn(Provider.prototype, 'getProviderById').mockImplementationOnce(() => null)
    })

    it('should return a status of 404', async () => {
      const response = await request(app).get('/1111111')

      expect(response.statusCode).toBe(404)
    })

    it('should return the expected error message', async () => {
      const response = await request(app).get('/1111111')

      expect(JSON.parse(response.text)).toHaveProperty('message', 'No Provider Found')
    })
  })
  describe('ID is not a number', () => {
    it('should return a status of 400', async () => {
      const response = await request(app).get('/tests')

      expect(response.statusCode).toBe(400)
    })

    it('should return the expected error message', async () => {
      const response = await request(app).get('/tests')

      expect(JSON.parse(response.text)).toHaveProperty('message', 'Invalid ID')
    })
  })
})