import ProviderController from '../../controllers/ProviderController'
import httpMocks from 'node-mocks-http'
import { faker } from '@faker-js/faker'
import { Request, Response } from 'express'
const Provider = require('../../models/Provider')

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
  user_id: 1,
  provider: 'backlog',
  space_key: 'UNI-CHART',
  api_key: 'apikey1234567890',
  project_key: 'unichart-key',
  project_name: 'project_name',
  project_id: faker.datatype.number()
}

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
})

describe('getProviderById()', () => {
  interface TypedResponse extends Response {
    statusCode: any
    _getData: () => any
  }

  let req: Request
  let Controller: any
  let res: TypedResponse

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    Controller = new ProviderController()
  })

  it('should return 400 and error details when ID is not number', async () => {
    req.params = { id: 'as' }

    Controller.getProviderById(req, res)
    const data = res._getData()

    expect(res.statusCode).toEqual(400)
    expect(JSON.parse(data)).toHaveProperty('message', 'Invalid ID')
  })

  it('should return 404 and error details if ID does not exist', async () => {
    req.params = { id: '11111' }

    await Controller.getProviderById(req, res)
    const data = res._getData()

    expect(res.statusCode).toEqual(404)
    expect(JSON.parse(data)).toHaveProperty('message', 'No Provider Found')
  })

  it('should return 200 and provider details if ID exist', async () => {
    const mockedResponse = {
      id: 1,
      user_id: 1,
      name: 'backlog',
      space_key: 'UNI-CHART',
      api_key: 'apikey1234567890',
      created_at: '2022-05-10T08:48:47.926Z',
      updated_at: '2022-05-10T08:48:47.927Z',
      projects: [
        {
          id: 1,
          name: 'project_name',
          key: 'unichart-key',
          project_id: 99846,
          provider_id: 1,
          created_at: '2022-05-10T09:26:03.707Z',
          updated_at: '2022-05-10T09:26:03.707Z'
        }
      ]
    }

    jest.spyOn(Provider.prototype, 'getProviderById').mockImplementationOnce(() => mockedResponse)

    const postReq = httpMocks.createRequest()
    const postRes = httpMocks.createResponse()
    postReq.body = payload2
    await Controller.add(postReq, postRes)

    req.params = { id: postRes._getData().id }
    await Controller.getProviderById(req, res)

    expect(res._getData()).toEqual(mockedResponse)
    expect(res.statusCode).toEqual(200)
  })
})
