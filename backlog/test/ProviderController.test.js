const ProviderController = require('../controllers/ProviderController')
const httpMocks = require('node-mocks-http')
const { faker } = require('@faker-js/faker')

const payload = {
  user_id: faker.datatype.number(),
  provider: 'backlog',
  space_key: faker.datatype.string(),
  api_key: faker.datatype.string(15),
  project_key: faker.datatype.string(),
  project_name: faker.datatype.string(),
  project_id: faker.datatype.number()
}

describe('Provider Controller', () => {
  let req, res, next
  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = null
  })

  it('Test #1 [200]: Insert provider success case', async () => {
    req.body = payload
    await ProviderController.add(req, res, next)
    expect(res.statusCode).toEqual(200)
    expect(res._getData()).toHaveProperty(
      'id',
      'user_id',
      'name',
      'space_key',
      'api_key',
      'created_at',
      'updated_at'
    )
  })

  it('Test #2 [400]: Project already registered', async () => {
    req.body = payload
    await ProviderController.add(req, res, next)
    expect(res.statusCode).toEqual(400)
    expect(res._getData()).toMatchObject([
      { message: `You already registered this project: ${payload.project_name}` }
    ])
  })

  it('Test #3 [422]: Insert provider fail case, validation error', async () => {
    await ProviderController.add(req, res, next)
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
