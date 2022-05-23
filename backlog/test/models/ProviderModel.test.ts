import Provider from '../../models/Provider'
import { prismaMock } from '../../utils/singleton'

let Model: any

const provider = {
  id: 1,
  user_id: 1,
  name: 'backlog',
  space_key: 'UNI-CHART',
  api_key: 'apikey1234567890',
  created_at: new Date(),
  updated_at: new Date(),
  projects: {
    id: 1001,
    name: 'project_name',
    key: 'unichart-key',
    project_id: 101,
    provider_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }
}

const project = [
  {
    id: 1001,
    name: 'project_name',
    key: 'unichart-key',
    project_id: 101,
    provider_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    provider: {
      id: 1,
      user_id: 1,
      name: 'backlog',
      space_key: 'UNI-CHART',
      api_key: 'apikey1234567890',
      created_at: new Date(),
      updated_at: new Date()
    }
  }
]

beforeEach(() => {
  Model = new Provider()
})

describe('When calling provider model "isProjectRegistered" method', () => {
  it('should return empty array if no project from db', async () => {
    prismaMock.project.findMany.mockResolvedValue([])
    const res = await Model.isProjectRegistered(provider)
    expect(res).toMatchObject([])
  })

  it('should return Project Object', async () => {
    prismaMock.project.findMany.mockResolvedValue(project)
    const res = await Model.isProjectRegistered(project)
    expect(res[0]).toEqual({
      id: 1001,
      name: 'project_name',
      key: 'unichart-key',
      project_id: 101,
      provider_id: 1,
      created_at: project[0].created_at,
      updated_at: project[0].updated_at,
      provider: {
        id: 1,
        user_id: 1,
        name: 'backlog',
        space_key: 'UNI-CHART',
        api_key: 'apikey1234567890',
        created_at: project[0].created_at,
        updated_at: project[0].updated_at
      }
    })
  })
})

describe('When calling provider model "add" method', () => {
  it('should return "Provider with Project" if data is valid', async () => {
    prismaMock.provider.upsert.mockResolvedValue(provider)
    const res = await Model.add(provider)
    expect(res).toEqual({
      id: 1,
      user_id: 1,
      name: 'backlog',
      space_key: 'UNI-CHART',
      api_key: 'apikey1234567890',
      created_at: provider.created_at,
      updated_at: provider.updated_at,
      projects: {
        id: 1001,
        name: 'project_name',
        key: 'unichart-key',
        project_id: 101,
        provider_id: 1,
        created_at: provider.created_at,
        updated_at: provider.updated_at
      }
    })
  })
})

describe('When calling provider model "getProviders" method', () => {
  it('should return empty array if no data from DB', async () => {
    prismaMock.provider.findMany.mockResolvedValue([])
    const response = await Model.getProviders(111111)
    expect.arrayContaining(response)
  })

  it('should return Array of objects if it has data from DB', async () => {
    prismaMock.provider.upsert.mockResolvedValue(provider)
    const data = await Model.add(provider)
    prismaMock.provider.findMany.mockResolvedValue([provider])
    const response = await Model.getProviders(data.user_id)
    expect.arrayContaining(response)
  })
})

describe('When calling provider model "getProviderById" method', () => {
  it('should return undefined if Provider ID is not found', async () => {
    const response = await Model.getProviderById(111111)
    expect(response).toStrictEqual(undefined)
  })

  it('should return an object if it has data in DB', async () => {
    prismaMock.provider.upsert.mockResolvedValue(provider)
    const data = await Model.add(provider)
    prismaMock.provider.findUnique.mockResolvedValue(provider)
    const response = await Model.getProviderById(data.id)
    expect(response).toMatchObject(data)
  })
})
