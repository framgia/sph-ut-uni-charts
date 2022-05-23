import Provider from '../../models/Provider'
import { prismaMock } from '../../utils/singleton'
import { mockedProviderResponse, mockedProjectResponse } from '../const/project'

let Model: any

beforeEach(() => {
  Model = new Provider()
})

describe('When calling provider model "isProjectRegistered" method', () => {
  it('should return empty array if no project from db', async () => {
    prismaMock.project.findMany.mockResolvedValue([])
    const res = await Model.isProjectRegistered(mockedProviderResponse)
    expect(res).toMatchObject([])
  })

  it('should return Project Object', async () => {
    prismaMock.project.findMany.mockResolvedValue([mockedProjectResponse])
    const res = await Model.isProjectRegistered(mockedProjectResponse)
    expect(res[0]).toMatchObject({
      id: 1,
      name: 'project_name',
      key: 'unichart-key',
      project_id: 99846,
      provider_id: 1,
      provider: {
        id: 1,
        user_id: 1,
        name: 'Backlog',
        space_key: 'UNI-CHART',
        api_key: 'apikey1234567890'
      }
    })
  })
})

describe('When calling provider model "add" method', () => {
  it('should return "Provider with Project" if data is valid', async () => {
    prismaMock.provider.upsert.mockResolvedValue(mockedProviderResponse)
    const res = await Model.add(mockedProviderResponse)

    expect(res).toMatchObject(mockedProviderResponse)
  })
})

describe('When calling provider model "getProviders" method', () => {
  it('should return empty array if no data from DB', async () => {
    prismaMock.provider.findMany.mockResolvedValue([])
    const response = await Model.getProviders(111111)
    expect.arrayContaining(response)
  })

  it('should return Array of objects if it has data from DB', async () => {
    prismaMock.provider.upsert.mockResolvedValue(mockedProviderResponse)
    const data = await Model.add(mockedProviderResponse)
    prismaMock.provider.findMany.mockResolvedValue([mockedProviderResponse])
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
    prismaMock.provider.upsert.mockResolvedValue(mockedProviderResponse)
    const data = await Model.add(mockedProviderResponse)
    prismaMock.provider.findUnique.mockResolvedValue(mockedProviderResponse)
    const response = await Model.getProviderById(data.id)
    expect(response).toMatchObject(data)
  })
})
