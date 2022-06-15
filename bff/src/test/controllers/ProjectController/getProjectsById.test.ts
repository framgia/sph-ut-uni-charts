import axios from 'axios'
import httpMocks from 'node-mocks-http'
import ProjectController from '../../../controllers/ProjectController'
import { CustomTypedResponse } from '../../../utils/interfaces'
import projectTestData from '../../constants/projectTestData.json'

const projectController = new ProjectController()

jest.mock('axios')

describe('When calling getProjectsById() function', () => {
  let request, response: CustomTypedResponse

  describe('if no user found', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // user_id
        Promise.reject()
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

    it('should return status of 403', () => {
      expect(response.statusCode).toBe(403)
    })

    it('should respond "Unauthorized access" as validation error', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Unauthorized access')
    })
  })

  describe('if no service was provided', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // user_id
        Promise.resolve({ data: { id: 1 } })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id',
        params: {
          id: 1
        }
      })

      response = httpMocks.createResponse()
      await projectController.getProjectById(request, response)
    })

    it('should return status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should respond "Service information not provided." as validation error', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Service information not provided.')
    })
  })

  describe('if ID exist in the database', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(Promise.resolve({ data: projectTestData.sampleProject }))

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
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
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
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
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
