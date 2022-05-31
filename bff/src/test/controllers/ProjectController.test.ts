require('dotenv').config()
import axios from 'axios'
import { rest } from 'msw'
import { Request } from 'express'
import ProjectController from '../../controllers/ProjectController'
import httpMocks from 'node-mocks-http'
import { CustomTypedResponse } from '../../utils/interfaces'
import projectTestData from '../constants/projectTestData.json'
import { server } from '../../../jest.setup'

const projectController = new ProjectController()

jest.mock('axios')

// beforeEach(() => {
//   server.use(
//     rest.get('*/users/', (req, res, ctx) => {
//       return res(ctx.status(200), ctx.json({ id: 1 }))
//     })
//   )
// })

describe('When calling getProjectsById() function', () => {
  let request, response: CustomTypedResponse

  describe('if ID exist in the database', () => {
    beforeAll(async () => {
      // ;(axios as any).mockResolvedValueOnce(
      //   Promise.resolve({ data: projectTestData.sampleProject })
      // )
      server.use(
        rest.get('*/users/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ id: 1 }))
        }),
        rest.get('*/projects/*', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ data: projectTestData.sampleProject }))
        })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id',
        params: {
          id: 1
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
      await projectController.getProjectById(request, response)
    })

    it('should return status of 200', () => {
      expect(response.statusCode).toBe(200)
    })

    it('should return project details', () => {
      const data = response._getData()
      expect(JSON.stringify(data)).toBe(JSON.stringify(projectTestData.sampleProject))
    })
  })

  describe('if ID does not exist in the database', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        Promise.reject({ response: { data: { message: 'No Data Found' }, status: 404 } })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id',
        params: {
          id: '111111'
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
      await projectController.getProjectById(request, response)
    })

    it('should return status 404', () => {
      expect(response.statusCode).toBe(404)
    })

    it('should respond "No Data Found" as validation error', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'No Data Found')
    })
  })

  describe('if ID is invalid', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        Promise.reject({ response: { data: { message: 'Invalid ID' }, status: 400 } })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id',
        params: {
          id: 'test'
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
      await projectController.getProjectById(request, response)
    })

    it('should return status 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should respond "No Data Found" as validation error', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Invalid ID')
    })
  })
})

describe('When calling getProjects() function', () => {
  let request: Request, response: CustomTypedResponse
  describe('when fetching is successful', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        Promise.resolve({ data: [projectTestData.sampleProject] })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects'
      })
      response = httpMocks.createResponse()
      await projectController.getProjects(request, response)
    })

    it('should return status of 200', () => {
      expect(response.statusCode).toBe(200)
    })

    it('should return the expected body', () => {
      const data = response._getData()
      expect(data[0]).toHaveProperty('id')
    })
  })
})

describe('When calling deleteProjectById() function', () => {
  let request: Request, response: CustomTypedResponse

  describe('if ID does not exist in the database', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        Promise.reject({ response: { data: { message: 'ID does not exist' }, status: 404 } })
      )

      request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/projects/:id',
        query: { service: 'backlog' },
        params: { id: '1' }
      })
      response = httpMocks.createResponse()

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
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        Promise.reject({ response: { data: { message: 'Invalid ID' }, status: 400 } })
      )

      request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/projects/:id',
        query: { service: 'backlog' },
        params: { id: 'test' }
      })
      response = httpMocks.createResponse()

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
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        Promise.resolve({ data: projectTestData.sampleProject })
      )

      request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/projects/:id',
        query: { service: 'backlog' },
        params: { id: 1 }
      })
      response = httpMocks.createResponse()

      await projectController.deleteProjectById(request, response)
    })

    it('should return status of 200', () => {
      expect(response.statusCode).toBe(200)
    })

    it('should return deleted project details', () => {
      const data = response._getData()

      expect(JSON.stringify(data)).toBe(JSON.stringify(projectTestData.sampleProject))
    })
  })
})
