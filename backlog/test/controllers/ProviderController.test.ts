import ProviderController from '../../controllers/ProviderController'
import httpMocks from 'node-mocks-http'
import { faker } from '@faker-js/faker'

const payload = {
  user_id: 1,
  provider: 'backlog',
  space_key: 'UNI-CHART',
  api_key: 'apikey1234567890',
  project_key: 'unichart-key',
  project_name: 'project_name',
  project_id: faker.datatype.number()
}

const payload2 = {
  user_id: 2,
  provider: 'backlog',
  space_key: 'UNI-CHART',
  api_key: 'apikey1234567890',
  project_key: 'unichart-key',
  project_name: 'project_name',
  project_id: faker.datatype.number()
}

const providerController = new ProviderController()

describe('Provider Controller', () => {
  let req: { body: any }, res: { statusCode: any; _getData: () => any }, Controller: any

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    Controller = new ProviderController()
  })

  it('Test #1 [200]: Insert provider success case', async () => {
    req.body = payload
    await Controller.add(req, res)
    expect(res.statusCode).toEqual(200)
    expect(res._getData()).toMatchObject({
      user_id: 1,
      name: 'backlog',
      space_key: 'UNI-CHART',
      api_key: 'apikey1234567890'
    })
  })

  it('Test #2 [400]: Project already registered', async () => {
    req.body = payload
    await Controller.add(req, res)
    expect(res.statusCode).toEqual(400)
    expect(res._getData()).toMatchObject([
      { message: 'You already registered this project: project_name' }
    ])
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
      {
        parameter: 'provider',
        value: undefined,
        message: 'Required value.'
      },
      {
        parameter: 'space_key',
        value: undefined,
        message: 'Required value.'
      },
      {
        parameter: 'api_key',
        value: undefined,
        message: 'Required value.'
      },
      {
        parameter: 'project_key',
        value: undefined,
        message: 'Required value.'
      },
      {
        parameter: 'project_name',
        value: undefined,
        message: 'Required value.'
      },
      {
        parameter: 'project_id',
        value: undefined,
        message: 'Required value.'
      }
    ])
  })

  it('Test #4 - getProviders() - Empty array', async () => {
    req.body = { user_id: '111111' }
    await Controller.getProviders(req, res)
    const data = res._getData()
    expect(data).toStrictEqual([])
  })

  it('Test #5 - getProviders() - Invalid user ID', async () => {
    req.body = { user_id: 'test' }
    await Controller.getProviders(req, res)
    const data = res._getData()
    expect(data).toHaveProperty('message', 'Invalid User ID')
  })

  it('Test #6 - getProviders() - Array of objects', async () => {
    req.body = payload
    await Controller.add(req, res)
    const data = res._getData()
    req.body = { user_id: data.user_id }
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
