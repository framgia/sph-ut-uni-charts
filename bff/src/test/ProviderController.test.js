const supertest = require('supertest')
const app = require('../index')
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
  it('Test #1 [200]: Insert provider success case', async () => {
    const res = await supertest(app).post('/api/providers/add').send(payload)
    expect(res.statusCode).toEqual(200)
    expect(JSON.parse(res.text)).toHaveProperty(
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
    const res = await supertest(app).post('/api/providers/add').send(payload)
    expect(res.statusCode).toEqual(400)
    expect(JSON.parse(res.text)).toMatchObject([
      {
        message: `You already registered this project: ${payload.project_name}`
      }
    ])
  })

  it('Test #3 [422]: Insert provider fail case, validation error', async () => {
    const res = await supertest(app).post('/api/providers/add').send({ provider: 'backlog' })
    expect(res.statusCode).toEqual(422)
    expect(JSON.parse(res.text)).toMatchObject([
      { parameter: 'user_id', message: 'Required value.' },
      { parameter: 'space_key', message: 'Required value.' },
      { parameter: 'api_key', message: 'Required value.' },
      { parameter: 'project_key', message: 'Required value.' },
      { parameter: 'project_name', message: 'Required value.' },
      { parameter: 'project_id', message: 'Required value.' }
    ])
  })

  it('Test #4 [400]: Insert provider fail case, provider not supported yet', async () => {
    const res = await supertest(app)
      .post('/api/providers/add')
      .send({ ...payload, provider: faker.datatype.string() })
    expect(res.statusCode).toEqual(400)
    expect(JSON.parse(res.text)).toMatchObject({ message: 'Invalid Provider' })
  })
})
