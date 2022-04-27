import ProviderController from '../controllers/ProviderController'
const httpMocks = require('node-mocks-http')
const { faker } = require('@faker-js/faker')

const payload = {
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
})
