const Provider = require('../../models/Provider')
import { MockContext, Context, createMockContext } from '../../utils/context'

let mockCtx: MockContext
let ctx: Context
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
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

describe('Provider Model', () => {
  test('Test #1: Should return empty array - Project not registered', async () => {
    mockCtx.prisma.project.findMany.mockResolvedValue([])
    const res = await Model.isProjectRegistered(provider, ctx)
    expect(res).toMatchObject([])
  })

  test('Test #2: Should return Provider with Project object', async () => {
    mockCtx.prisma.provider.upsert.mockResolvedValue(provider)
    const res = await Model.add(provider, ctx)
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

  test('Test #3: Should return Porject Object - Project is registered', async () => {
    mockCtx.prisma.project.findMany.mockResolvedValue(project)
    const res = await Model.isProjectRegistered(project, ctx)
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

  test('Test #4: getProviders() - Empty array', async () => {
    mockCtx.prisma.provider.findMany.mockResolvedValue([])
    const response = await Model.getProviders(111111, ctx)
    expect.arrayContaining(response)
  })

  test('Test #5: getProviders() - Array of objects', async () => {
    mockCtx.prisma.provider.upsert.mockResolvedValue(provider)
    const data = await Model.add(provider, ctx)
    mockCtx.prisma.provider.findMany.mockResolvedValue([provider])
    const response = await Model.getProviders(data.user_id, ctx)
    expect.arrayContaining(response)
  })

  test('Test #6: getProviderById() - Provider ID not found', async () => {
    const response = await Model.getProviderById(111111, ctx)
    expect(response).toStrictEqual(undefined)
  })

  test('Test #6: getProviderById() - Provider ID Found', async () => {
    mockCtx.prisma.provider.upsert.mockResolvedValue(provider)
    const data = await Model.add(provider, ctx)
    mockCtx.prisma.provider.findUnique.mockResolvedValue(provider)
    const response = await Model.getProviderById(data.id, ctx)
    expect(response).toMatchObject(data)
  })
})
