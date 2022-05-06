require('dotenv').config()
import ProviderController from '../../controllers/ProviderController'
import httpMocks from 'node-mocks-http'
import { faker } from '@faker-js/faker'
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

const payload = {
  user_id: 1,
  name: 'Backlog',
  api_key: '123apikey123',
  project_id: faker.datatype.number()
}

const payload2 = {
  user_id: 1,
  name: 'Backlog',
  api_key: '123apikey123',
  project_id: faker.datatype.number()
}

const providerController = new ProviderController()

describe('Provider Controller', () => {
  let req: { body?: any; query?: any; params?: any },
    res: { statusCode: any; _getData: () => any },
    Controller: any
  const mockAxios = new MockAdapter(axios)

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    Controller = new ProviderController()
    mockAxios.onGet('/api/v2/space', { params: { apiKey: payload.api_key } }).reply(200, {
      spaceKey: 'nulab',
      name: 'Nulab Inc.',
      ownerId: 1
    })
    mockAxios
      .onGet(`/api/v2/projects/${payload.project_id}`, { params: { apiKey: payload.api_key } })
      .reply(200, {
        id: 1,
        projectKey: 'TEST',
        name: 'test'
      })
    mockAxios
      .onGet(`/api/v2/projects/${payload2.project_id}`, { params: { apiKey: payload.api_key } })
      .reply(200, {
        id: 1,
        projectKey: 'TEST',
        name: 'test'
      })
  })

  it('Test #1 [200]: Insert provider success case', async () => {
    req.body = payload
    await Controller.add(req, res)
    expect(res.statusCode).toEqual(200)
    expect(res._getData()).toMatchObject({
      user_id: 1,
      name: 'Backlog',
      space_key: 'nulab',
      api_key: '123apikey123'
    })
  })

  it('Test #2 [400]: Project already registered', async () => {
    req.body = payload
    await Controller.add(req, res)
    expect(res.statusCode).toEqual(400)
  })

  it('Test #3 [422]: Insert provider fail case, validation error', async () => {
    await Controller.add(req, res)
    expect(res.statusCode).toEqual(422)
    expect(res._getData()).toMatchObject([
      {
        parameter: 'user_id',
        value: undefined,
        message: 'Required value.'
      },
      { parameter: 'name', value: undefined, message: 'Required value.' },
      {
        parameter: 'project_id',
        value: undefined,
        message: 'Required value.'
      }
    ])
  })

  it('Test #4 - getProviders() - Empty array', async () => {
    req.query = { user_id: 9999999 }
    await Controller.getProviders(req, res)
    const data = res._getData()
    expect(data).toStrictEqual([])
  })

  it('Test #5 - getProviders() - Invalid user ID', async () => {
    req.query = { user_id: 'test' }
    await Controller.getProviders(req, res)
    const data = res._getData()
    expect(data).toMatchObject([
      { message: 'Incorrect type. Expected number.', parameter: 'user_id', value: 'test' }
    ])
  })

  it('Test #6 - getProviders() - Array of objects', async () => {
    req.body = payload
    await Controller.add(req, res)
    const data = res._getData()
    req.query = { user_id: data.user_id }
    await Controller.getProviders(req, res)
    const result = res._getData()
    expect.arrayContaining(result)
  })

  describe('Provider controller - get using id', () => {
    it('Test #7 /:id [400]: non numerical id', async () => {
      const getReq = httpMocks.createRequest()
      const getRes = httpMocks.createResponse()
      getReq.params = { id: 'as' }
      await providerController.getProviderById(getReq, getRes)
      const data = getRes._getData()
      expect(data).toHaveProperty('message', 'Invalid ID')
    })

    it('Test #8 /:id [404]: provider with given id not found', async () => {
      const getReq = httpMocks.createRequest()
      const getRes = httpMocks.createResponse()
      getReq.params = { id: '11111' }
      await providerController.getProviderById(getReq, getRes)
      const data = getRes._getData()
      expect(data).toHaveProperty('message', 'No Provider Found')
    })

    it('Test #9 /:id [200]: valid id', async () => {
      const postReq = httpMocks.createRequest()
      const postRes = httpMocks.createResponse()
      postReq.body = payload2
      await Controller.add(postReq, postRes)
      const getReq = httpMocks.createRequest()
      const getRes = httpMocks.createResponse()
      getReq.params = { id: postRes._getData().id }
      await Controller.getProviderById(getReq, getRes)
      expect(getRes._getData()).toMatchObject(postRes._getData())
      expect(getRes.statusCode).toEqual(200)
    })
  })
})
