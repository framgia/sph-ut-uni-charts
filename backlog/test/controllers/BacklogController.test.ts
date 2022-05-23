require('dotenv').config()
import BacklogController from '../../controllers/BacklogController'
import httpMocks from 'node-mocks-http'
import { prismaMock } from '../../utils/singleton'
import { Request, Response } from 'express'
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

describe('When getting project list from external backlog api', () => {
  interface TypedResponse extends Response {
    statusCode: any
    _getData: () => any
  }

  let req: Request
  let res: TypedResponse
  let Controller: any
  const mockAxios = new MockAdapter(axios)

  const payload = { apiKey: 'apikey123' }

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    Controller = new BacklogController()
  })

  it('should return 404 error if apikey is wrong', async () => {
    req.query = payload
    await Controller.getList(req, res)

    expect(res.statusCode).toEqual(404)
  })

  it('should return list of projects successfully', async () => {
    mockAxios.onGet(`/api/v2/projects`, { params: { apiKey: payload.apiKey } }).reply(200, [
      {
        id: 1,
        projectKey: 'unichart-key',
        name: 'project_name'
      }
    ])

    req.query = payload
    await Controller.getList(req, res)

    expect(res.statusCode).toEqual(200)
    expect(res._getData()).toMatchObject([
      {
        id: 1,
        projectKey: 'unichart-key',
        name: 'project_name'
      }
    ])
  })

  it('should return list of projects successfully', async () => {
    prismaMock.provider.findUnique.mockResolvedValue({
      id: 1,
      user_id: 1,
      name: 'backlog',
      space_key: 'UNI-CHART',
      api_key: 'apikey1234567890',
      created_at: new Date(),
      updated_at: new Date()
    })
    mockAxios.onGet(`/api/v2/projects`, { params: { apiKey: 'apikey1234567890' } }).reply(200, [
      {
        id: 1,
        projectKey: 'unichart-key',
        name: 'project_name'
      }
    ])

    /* @ts-ignore */
    req.query = { providerId: 1 }
    await Controller.getList(req, res)

    expect(res.statusCode).toEqual(200)
    expect(res._getData()).toMatchObject([
      {
        id: 1,
        projectKey: 'unichart-key',
        name: 'project_name'
      }
    ])
  })
})
