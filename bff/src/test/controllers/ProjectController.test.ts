import { Request } from 'express'
import { rest } from 'msw'
import ProjectController from '../../controllers/ProjectController'
import httpMocks from 'node-mocks-http'
import BacklogService from '../../services/BacklogService'
import { server } from '../../../jest.setup'
import { CustomTypedResponse } from '../../utils/interfaces'
import testData from '../constants/projectTestData.json'

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

describe('When calling deleteProjectById() function', () => {
  let request: Request
  let response: CustomTypedResponse

  beforeEach(() => {
    request = httpMocks.createRequest({
      method: 'DELETE',
      url: '/projects/:id'
    })
    request.query = { service: 'backlog' }

    response = httpMocks.createResponse()
  })

  describe('if ID does not exist in the database', () => {
    beforeEach(async () => {
      server.use(
        rest.delete('*/api/projects/:id', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ message: 'ID does not exist' }))
        })
      )

      request.params = { id: '1' }

      await projectController.deleteProjectById(request, response)
    })

    it('should return status of 404', () => {
      expect(response.statusCode).toBe(404)
    })

    it('should return expected error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'ID does not exist')
    })
  })

  describe('if invalid ID, letters are not valid, should be number', () => {
    beforeEach(async () => {
      request.params = { id: 'test' }

      await projectController.deleteProjectById(request, response)
    })

    it('should return status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return expected error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('if valid ID', () => {
    beforeEach(async () => {
      server.use(
        rest.delete('*/api/projects/:id', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(testData.sampleProject))
        })
      )

      request.params = { id: '1' }

      await projectController.deleteProjectById(request, response)
    })

    it('should return status of 200', () => {
      expect(response.statusCode).toBe(200)
    })

    it('should return deleted project details', () => {
      const data = response._getData()

      expect(JSON.stringify(data)).toBe(JSON.stringify(testData.sampleProject))
    })
  })
})
