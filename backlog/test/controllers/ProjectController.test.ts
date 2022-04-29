import { PrismaClient } from '@prisma/client'
import httpMocks from 'node-mocks-http'
import ProjectController from '../../controllers/ProjectController'

const prisma = new PrismaClient()
const projectController = new ProjectController()

describe('Project Controller Test Suite', () => {
  let project: any

  beforeEach(async () => {
    const provider = await prisma.provider.create({
      data: {
        user_id: 1,
        name: 'provider-1',
        space_key: 'space-key-1',
        api_key: 'api-key-1'
      }
    })

    project = await prisma.project.create({
      data: {
        name: 'provider-1',
        key: 'key-1',
        project_id: 1,
        provider_id: provider.id
      }
    })
  })

  afterEach(async () => {
    const projects = prisma.project.deleteMany()
    const providers = prisma.provider.deleteMany()
    await prisma.$transaction([projects, providers])
    await prisma.$disconnect()
  })

  test('Test #1: getProjectById - if ID exist or not in the database', async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/projects/:id',
      params: {
        id: `${project.id}`
      }
    })

    const response = httpMocks.createResponse()
    await projectController.getProjectById(request, response)
    const data = response._getData()

    expect(data).toMatchObject({
      id: project.id,
      name: 'provider-1',
      key: 'key-1',
      project_id: 1,
      provider_id: project.provider_id
    })
  })

  test('Test #2: getProjectById - if ID does not exist orin the database', async () => {
    const projects = prisma.project.deleteMany()
    const providers = prisma.provider.deleteMany()
    await prisma.$transaction([projects, providers])

    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/projects/:id',
      params: {
        id: '111111'
      }
    })

    const response = httpMocks.createResponse()
    await projectController.getProjectById(request, response)
    const data = response._getData()
    expect(data).toHaveProperty('message', 'No Data Found')
  })

  test('Test #3: getProjectById - invalid ID, letters are not valid, it should be a number', async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/projects/:id',
      params: {
        id: 'tests'
      }
    })

    const response = httpMocks.createResponse()
    await projectController.getProjectById(request, response)
    const data = response._getData()
    expect(data).toHaveProperty('message', 'Invalid ID')
  })

  test('Test #4: /projects - with array of objects', async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/projects'
    })

    const response = httpMocks.createResponse()
    await projectController.getProjects(request, response)
    const data = response._getData()
    const filteredData = data.filter((obj: any) => obj.id === project.id)

    expect(filteredData[0]).toMatchObject({
      id: project.id,
      name: 'provider-1',
      key: 'key-1',
      project_id: 1,
      provider_id: project.provider_id
    })
  })

  test('Test #5: /projects - with empty array', async () => {
    const projects = prisma.project.deleteMany()
    const providers = prisma.provider.deleteMany()
    await prisma.$transaction([projects, providers])

    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/projects'
    })

    const response = httpMocks.createResponse()
    await projectController.getProjects(request, response)
    const data = response._getData()
    expect(data).toStrictEqual([])
  })

  test('Test #6: getProjectById - if ID does not exist orin the database', async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/projects/:id',
      params: {
        id: '111111'
      }
    })

    const response = httpMocks.createResponse()
    await projectController.getProjectById(request, response)
    const data = response._getData()
    expect(data).toHaveProperty('message', 'No Data Found')
  })

  test('Test #7: deleteProjectById - invalid ID, it should be a number', async () => {
    const request = httpMocks.createRequest({
      method: 'DELETE',
      url: '/delete/:id',
      params: {
        id: 'test'
      }
    })

    const response = httpMocks.createResponse()
    await projectController.deleteProjectById(request, response)
    const data = response._getData()
    expect(data).toHaveProperty('message','Invalid ID')
  })
})
