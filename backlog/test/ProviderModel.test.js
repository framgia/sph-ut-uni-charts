const Provider = require('../models/Provider')
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

describe('Provider Model', () => {
  test('Test #1: Should return empty array - Project not registered', async () => {
    const res = await Provider.isProjectRegistered(payload)
    expect(res).toMatchObject([])
  })

  test('Test #2: Should return Provider with Project object', async () => {
    const res = await Provider.add(payload)
    expect(res).toHaveProperty(
      'id',
      'user_id',
      'name',
      'space_key',
      'api_key',
      'created_at',
      'updated_at'
    )
  })

  test('Test #3: Should return Porject Object - Project is registered', async () => {
    const res = await Provider.isProjectRegistered(payload)
    expect(res[0]).toHaveProperty(
      'id',
      'key',
      'name',
      'project_id',
      'provider_id',
      'created_at',
      'updated_at'
    )
  })
})
