require('dotenv').config()
import ProviderController from '../../controllers/ProviderController'
import httpMocks from 'node-mocks-http'
import { Request, Response } from 'express'
import Provider from '../../models/Provider'
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

const mockedProviderResponse = {
  id: 1,
  user_id: 1,
  name: 'Backlog',
  space_key: 'UNI-CHART',
  api_key: 'apikey1234567890',
  created_at: new Date(),
  updated_at: new Date(),
  projects: [
    {
      id: 1,
      name: 'project_name',
      key: 'unichart-key',
      project_id: 99846,
      provider_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]
}

const mockedProjectResponse = {
  id: 1,
  name: 'project_name',
  key: 'unichart-key',
  project_id: 99846,
  provider_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  provider: {
    id: 1,
    user_id: 1,
    name: 'Backlog',
    space_key: 'UNI-CHART',
    api_key: 'apikey1234567890',
    created_at: new Date(),
    updated_at: new Date()
  }
}

const payload = {
  user_id: 1,
  name: 'Backlog',
  api_key: 'apikey1234567890',
  project_id: 123
}

describe('When adding providers', () => {
  interface TypedResponse extends Response {
    statusCode: any
    _getData: () => any
  }

  let req: Request
  let res: TypedResponse
  let Controller: any

  const mockAxios = new MockAdapter(axios)

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    Controller = new ProviderController()
    mockAxios.onGet('/api/v2/space', { params: { apiKey: payload.api_key } }).reply(200, {
      spaceKey: 'UNI-CHART',
      name: 'Project Name',
      ownerId: 1
    })
    mockAxios
      .onGet(`/api/v2/projects/${payload.project_id}`, { params: { apiKey: payload.api_key } })
      .reply(200, {
        id: 1,
        projectKey: 'unichart-key',
        name: 'project_name'
      })
  })

  it('should insert provider successfully', async () => {
    jest.spyOn(Provider.prototype, 'add').mockImplementationOnce(async () => mockedProviderResponse)

    req.body = payload
    await Controller.add(req, res)
    expect(res.statusCode).toEqual(200)
    expect(res._getData()).toMatchObject({
      id: 1,
      user_id: 1,
      name: 'Backlog',
      space_key: 'UNI-CHART',
      api_key: 'apikey1234567890'
    })
  })

  it('should throw an error if Project already registered', async () => {
    jest
      .spyOn(Provider.prototype, 'isProjectRegistered')
      .mockImplementationOnce(async () => [mockedProjectResponse])

    req.body = payload
    await Controller.add(req, res)
    expect(res.statusCode).toEqual(400)
  })

  it('should return validation errors if incorrect payload', async () => {
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
})

describe('When getting list of providers', () => {
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

  it('should return an empty array if no data from DB', async () => {
    /* @ts-ignore */
    req.query = { user_id: 999999 }
    await Controller.getProviders(req, res)
    const data = res._getData()
    expect(data).toStrictEqual([])
  })

  it('should return validation error when user id is invalid', async () => {
    req.query = { user_id: 'test' }
    await Controller.getProviders(req, res)
    const data = res._getData()
    expect(data).toMatchObject([
      { message: 'Incorrect type. Expected number.', parameter: 'user_id', value: 'test' }
    ])
  })

  it('should return array of objects after adding some data', async () => {
    jest.spyOn(Provider.prototype, 'add').mockImplementationOnce(async () => mockedProviderResponse)
    req.body = payload
    await Controller.add(req, res)

    const data = res._getData()
    req.query = { user_id: data.user_id }
    await Controller.getProviders(req, res)

    const result = res._getData()
    expect.arrayContaining(result)
  })
})

describe('When using getProviderById() function', () => {
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

  describe('when ID is not a number', () => {
    beforeEach(async () => {
      req.params = { id: 'as' }
      await Controller.getProviderById(req, res)
    })

    it('should return a status of 400', () => {
      expect(res.statusCode).toEqual(400)
    })

    it('should return the expected error message', () => {
      const data = res._getData()

      expect(JSON.parse(data)).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('when ID does not exist', () => {
    beforeEach(async () => {
      jest.spyOn(Provider.prototype, 'getProviderById').mockImplementationOnce(async () => null)

      req.params = { id: '11111' }
      await Controller.getProviderById(req, res)
    })

    it('should return a status of 404', () => {
      expect(res.statusCode).toEqual(404)
    })

    it('should return the expected error message', () => {
      const data = res._getData()

      expect(JSON.parse(data)).toHaveProperty('message', 'No Provider Found')
    })
  })

  describe('when ID exists', () => {
    beforeEach(async () => {
      jest
        .spyOn(Provider.prototype, 'getProviderById')
        .mockImplementationOnce(async () => mockedProviderResponse)

      req.params = { id: '1' }
      await Controller.getProviderById(req, res)
    })

    it('should return a status of 200', () => {
      expect(res.statusCode).toEqual(200)
    })

    it('should return the expected body', () => {
      expect(res._getData()).toEqual(mockedProviderResponse)
    })
  })
})
