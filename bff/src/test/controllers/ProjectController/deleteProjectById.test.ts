import axios from 'axios'
import { Request } from 'express'
import httpMocks from 'node-mocks-http'
import ProjectController from '../../../controllers/ProjectController'
import { CustomTypedResponse } from '../../../utils/interfaces'
import projectTestData from '../../constants/projectTestData.json'

const projectController = new ProjectController()

jest.mock('axios')

describe('When calling deleteProjectById() function', () => {
  let request: Request, response: CustomTypedResponse

  describe('if no user found', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // user_id
        Promise.reject()
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

    it('should return status of 403', () => {
      expect(response.statusCode).toBe(403)
    })

    it('should return "Unauthorized access" as error message', () => {
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
        method: 'DELETE',
        url: '/projects/:id',
        params: { id: '1' }
      })
      response = httpMocks.createResponse()

      await projectController.deleteProjectById(request, response)
    })

    it('should return status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return "Service information is not provided." as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Service information is not provided.')
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
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
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
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(Promise.resolve({ data: projectTestData.sampleProject }))

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
