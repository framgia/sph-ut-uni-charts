import ProjectController from '../../controllers/ProjectController'
import httpMocks from 'node-mocks-http'
import BacklogService from '../../services/BacklogService'

const backlogService = new BacklogService()
const projectController = new ProjectController()

describe('Project Controller Test Suite', () => {
  test('Test #1: getProjectById - if ID exist in the database', async () => {
    const projects: any = await backlogService.getProjects()

    if (!projects.length) {
      expect(projects).toStrictEqual([])
    } else {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id',
        params: {
          id: `${projects[0].id}`
        },
        body: {
          service: 'backlog'
        }
      })

      const response = httpMocks.createResponse()
      await projectController.getProjectById(request, response)
      const data = response._getData()
      expect(data).toHaveProperty('id')
    }
  })

  test('Test #2: getProjectById - if ID does not exist in the database', async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/projects/:id',
      params: {
        id: '111111'
      },
      body: {
        service: 'backlog'
      }
    })

    const response = httpMocks.createResponse()
    await projectController.getProjectById(request, response)
    const data = response._getData()
    expect(data).toHaveProperty('message', 'No Data Found')
  })

  test('Test #3: getProjectById - invalid ID, letters are not valid', async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/projects/:id',
      params: {
        id: 'test'
      },
      body: {
        service: 'backlog'
      }
    })

    const response = httpMocks.createResponse()
    await projectController.getProjectById(request, response)
    const data = response._getData()
    expect(data).toHaveProperty('message', 'Invalid ID')
  })

  test('Test #4: getProjects - either array of objects or empty array', async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/projects'
    })

    const response = httpMocks.createResponse()
    await projectController.getProjects(request, response)
    const data = response._getData()
    if (!data.length) expect(data).toStrictEqual([])
    else expect(data[0]).toHaveProperty('id')
  })
})
