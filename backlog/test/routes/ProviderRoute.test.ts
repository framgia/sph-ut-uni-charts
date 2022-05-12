import request from 'supertest'
import express from 'express'

import ProviderRoute from '../../routes/ProviderRoute'
const Provider = require('../../models/Provider')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', ProviderRoute)

describe('/providers/:id', () => {
  it('should return 200 and provider details when ID exists', async () => {
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

    jest.spyOn(Provider.prototype, 'getProviderById').mockImplementationOnce(() => mockedResponse)

    const response = await request(app).get(`/1111`)
    const parsedResponse = JSON.parse(response.text)

    expect(response.statusCode).toBe(200)
    expect(parsedResponse).toMatchObject(mockedResponse)
  })

  it('should return 404 and error details when ID do not exist', async () => {
    jest.spyOn(Provider.prototype, 'getProviderById').mockImplementationOnce(() => null)

    const response = await request(app).get('/1111111')

    expect(response.statusCode).toBe(404)
    expect(JSON.parse(response.text)).toHaveProperty('message', 'No Provider Found')
  })

  it('should return 400 and error details when ID is not number', async () => {
    const response = await request(app).get('/tests')

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.text)).toHaveProperty('message', 'Invalid ID')
  })
})
