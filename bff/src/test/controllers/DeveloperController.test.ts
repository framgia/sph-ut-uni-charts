import axios from 'axios'
import { Request } from 'express'
import httpMocks from 'node-mocks-http'
import DeveloperController from '../../controllers/DeveloperController'
import { CustomTypedResponse } from '../../utils/interfaces'
import projectTestData from '../constants/projectTestData.json'
import developerTestData from '../constants/developerTestData.json'

const developerController = new DeveloperController()

jest.mock('axios')

describe('When using getDeveloperIcon() function', () => {
  let request: Request, response: CustomTypedResponse

  describe('if user is unauthenticated', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // user_id
        Promise.reject()
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id/icon',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperIcon(request, response)
    })

    it('should return status of 403', () => {
      expect(response.statusCode).toBe(403)
    })

    it('should return "Unauthorized access" as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Unauthorized access')
    })
  })

  describe('if no service is provided', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // user_id
        Promise.resolve({ data: { id: 1 } })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id/icon',
        query: { project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperIcon(request, response)
    })

    it('should return status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return "Service information not provided." as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Service information not provided.')
    })
  })

  describe('if no project_id is provided', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // user_id
        Promise.resolve({ data: { id: 1 } })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id/icon',
        query: { service: 'backlog' },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperIcon(request, response)
    })

    it('should return status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return "Project ID not provided." as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Project ID not provided.')
    })
  })

  describe('if invalid developer ID is provided', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // user_id
        Promise.resolve({ data: { id: 1 } })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id/icon',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: 'test' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperIcon(request, response)
    })

    it('should return status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return "Invalid developer ID" as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Invalid developer ID')
    })
  })

  describe('if getting project returned an error', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
          // project
          Promise.reject({ response: { data: { message: 'ID does not exist' }, status: 404 } })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id/icon',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperIcon(request, response)
    })

    it('should return expected status', () => {
      expect(response.statusCode).toBe(404)
    })

    it('should return expected as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'ID does not exist')
    })
  })

  describe('if getting provider returned an error', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
      ;(axios.get as any).mockResolvedValueOnce(
        // provider
        Promise.reject({ response: { data: { message: 'Invalid ID' }, status: 400 } })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id/icon',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperIcon(request, response)
    })

    it('should return expected status', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return expected error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('if getting icon returned an error', () => {
    const error = {
      errors: [
        {
          message: '',
          code: 5,
          moreInfo: ''
        }
      ]
    }

    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // icon
          Promise.reject({ response: { status: 403, data: error } })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id/icon',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperIcon(request, response)
    })

    it('should return expected status', () => {
      expect(response.statusCode).toBe(403)
    })

    it('should return expected error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('errors', error.errors)
    })
  })

  describe('if everything is successful', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // icon
          Promise.resolve({
            data: Buffer.from('icon', 'utf8'),
            headers: { 'content-type': 'image/png' }
          })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id/icon',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperIcon(request, response)
    })

    it('should return expected status', () => {
      expect(response.statusCode).toBe(200)
    })

    it('should return expected error message', () => {
      const data = response._getData()
      expect(data).toBe('data:image/png;base64,aWNvbg==')
    })
  })
})

describe('When using getDeveloperInfo() function', () => {
  let request: Request, response: CustomTypedResponse

  describe('if user is unauthenticated', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // user_id
        Promise.reject()
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperInfo(request, response)
    })

    it('should return status of 403', () => {
      expect(response.statusCode).toBe(403)
    })

    it('should return "Unauthorized access" as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Unauthorized access')
    })
  })

  describe('if no service is provided', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // user_id
        Promise.resolve({ data: { id: 1 } })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id',
        query: { project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperInfo(request, response)
    })

    it('should return status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return "Service information not provided." as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Service information not provided.')
    })
  })

  describe('if invalid developer ID is provided', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // user_id
        Promise.resolve({ data: { id: 1 } })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: 'test' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperInfo(request, response)
    })

    it('should return status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return "Invalid developer ID" as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Invalid developer ID')
    })
  })

  describe('if no project_id is provided', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // user_id
        Promise.resolve({ data: { id: 1 } })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id',
        query: { service: 'backlog' },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperInfo(request, response)
    })

    it('should return status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return "Project ID not provided." as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Project ID not provided.')
    })
  })

  describe('if getting project returned an error', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
          // project
          Promise.reject({ response: { data: { message: 'ID does not exist' }, status: 404 } })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperInfo(request, response)
    })

    it('should return expected status', () => {
      expect(response.statusCode).toBe(404)
    })

    it('should return expected error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'ID does not exist')
    })
  })

  describe('if getting provider returned an error', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
      ;(axios.get as any).mockResolvedValueOnce(
        // provider
        Promise.reject({ response: { data: { message: 'Invalid ID' }, status: 400 } })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperInfo(request, response)
    })

    it('should return expected status', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return expected error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('if getting developer info returned an error', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // developer info
          Promise.reject({
            response: { data: { message: projectTestData.sampleError }, status: 400 }
          })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperInfo(request, response)
    })

    it('should return expected status', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return expected error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', projectTestData.sampleError)
    })
  })

  describe('if getting issues returned an error', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // developer info
          Promise.resolve({ data: developerTestData.sampleDeveloper })
        )
        .mockResolvedValueOnce(
          // issues
          Promise.reject({
            response: { data: { message: 'Invalid ID' }, status: 400 }
          })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperInfo(request, response)
    })

    it('should return expected status', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return expected error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('if there are no issues', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // developer info
          Promise.resolve({ data: developerTestData.sampleDeveloper })
        )
        .mockResolvedValueOnce(
          // issues
          Promise.resolve({ data: [] })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperInfo(request, response)
    })

    it('should return status of 404', () => {
      expect(response.statusCode).toBe(404)
    })

    it('should return "No issues found" as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'No issues found')
    })
  })

  describe('if getting milestones returned an error', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // developer info
          Promise.resolve({ data: developerTestData.sampleDeveloper })
        )
        .mockResolvedValueOnce(
          // issues
          Promise.resolve({ data: projectTestData.sampleMultipleIssues })
        )
        .mockResolvedValueOnce(
          // milestones
          Promise.reject({
            response: { data: { message: projectTestData.sampleError }, status: 400 }
          })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperInfo(request, response)
    })

    it('should return expected status', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return expected error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', projectTestData.sampleError)
    })
  })

  describe('if there are no milestones', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // developer info
          Promise.resolve({ data: developerTestData.sampleDeveloper })
        )
        .mockResolvedValueOnce(
          // issues
          Promise.resolve({ data: projectTestData.sampleMultipleIssues })
        )
        .mockResolvedValueOnce(
          // milestones
          Promise.resolve({ data: [] })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperInfo(request, response)
    })

    it('should return status of 404', () => {
      expect(response.statusCode).toBe(404)
    })

    it('should return "No milestones found" as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'No milestones found')
    })
  })

  describe('if everything is ok', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // user_id
          Promise.resolve({ data: { id: 1 } })
        )
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // developer info
          Promise.resolve({ data: developerTestData.sampleDeveloper })
        )
        .mockResolvedValueOnce(
          // issues
          Promise.resolve({ data: projectTestData.sampleMultipleIssues })
        )
        .mockResolvedValueOnce(
          // milestones
          Promise.resolve({ data: projectTestData.sampleMilestone })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/developer/:developer_id',
        query: { service: 'backlog', project_id: 1 },
        params: { developer_id: '1' }
      })
      response = httpMocks.createResponse()

      await developerController.getDeveloperInfo(request, response)
    })

    it('should return expected body', () => {
      const data = response._getData()
      expect(JSON.stringify(data)).toBe(
        JSON.stringify({
          name: 'name',
          velocity: 10,
          closedOnTimePercentage: 50,
          movedIssuePercentage: 66.67
        })
      )
    })
  })
})
