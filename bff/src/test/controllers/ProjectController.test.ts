import axios from 'axios'
import { Request } from 'express'
import httpMocks from 'node-mocks-http'
import ProjectController from '../../controllers/ProjectController'
import { CustomTypedResponse } from '../../utils/interfaces'
import projectTestData from '../constants/projectTestData.json'

const projectController = new ProjectController()

jest.mock('axios')

describe('When calling getProjectsById() function', () => {
  // let request, response: CustomTypedResponse

  test('Sample test', () => {
    //tests here are need to refactor or remove
  })

  // describe('if ID exist in the database', () => {
  //   beforeAll(async () => {
  //     ;(axios as any).mockResolvedValueOnce(
  //       Promise.resolve({ data: projectTestData.sampleProject })
  //     )

  //     request = httpMocks.createRequest({
  //       method: 'GET',
  //       url: '/projects/:id',
  //       params: {
  //         id: 1
  //       },
  //       query: {
  //         service: 'backlog'
  //       }
  //     })

  //     response = httpMocks.createResponse()
  //     await projectController.getProjectById(request, response)
  //   })

  //   it('should return status of 200', () => {
  //     expect(response.statusCode).toBe(200)
  //   })

  //   it('should return project details', () => {
  //     const data = response._getData()
  //     expect(JSON.stringify(data)).toBe(JSON.stringify(projectTestData.sampleProject))
  //   })
  // })

  // describe('if ID does not exist in the database', () => {
  //   beforeAll(async () => {
  //     ;(axios as any).mockResolvedValueOnce(
  //       Promise.reject({ response: { data: { message: 'No Data Found' }, status: 404 } })
  //     )

  //     request = httpMocks.createRequest({
  //       method: 'GET',
  //       url: '/projects/:id',
  //       params: {
  //         id: '111111'
  //       },
  //       query: {
  //         service: 'backlog'
  //       }
  //     })

  //     response = httpMocks.createResponse()
  //     await projectController.getProjectById(request, response)
  //   })

  //   it('should return status 404', () => {
  //     expect(response.statusCode).toBe(404)
  //   })

  //   it('should respond "No Data Found" as validation error', () => {
  //     const data = response._getJSONData()
  //     expect(data).toHaveProperty('message', 'No Data Found')
  //   })
  // })

  // describe('if ID is invalid', () => {
  //   beforeAll(async () => {
  //     ;(axios as any).mockResolvedValueOnce(
  //       Promise.reject({ response: { data: { message: 'Invalid ID' }, status: 400 } })
  //     )

  //     request = httpMocks.createRequest({
  //       method: 'GET',
  //       url: '/projects/:id',
  //       params: {
  //         id: 'test'
  //       },
  //       query: {
  //         service: 'backlog'
  //       }
  //     })

  //     response = httpMocks.createResponse()
  //     await projectController.getProjectById(request, response)
  //   })

  //   it('should return status 400', () => {
  //     expect(response.statusCode).toBe(400)
  //   })

  //   it('should respond "No Data Found" as validation error', () => {
  //     const data = response._getJSONData()
  //     expect(data).toHaveProperty('message', 'Invalid ID')
  //   })
  // })
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

describe('When calling getActiveSprintData() function', () => {
  let request, response: CustomTypedResponse
  const sampleMilestoneWithActiveSprint = JSON.parse(
    JSON.stringify(projectTestData.sampleMilestone)
  )
  sampleMilestoneWithActiveSprint[0].releaseDueDate = new Date().toISOString()

  describe('if no services is provided', () => {
    beforeAll(async () => {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: '1'
        }
      })

      response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
    })

    it('should return status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return "Service information not provided." as error message', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Service information not provided.')
    })
  })

  describe('if getting project returned an error', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // project
        Promise.reject({ response: { data: { message: 'Invalid ID' }, status: 400 } })
      )
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: '1'
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
    })

    it('should return the expected status', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return expected body', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('if getting provider returned an error', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // project
        Promise.resolve({ data: projectTestData.sampleProject })
      )
      ;(axios.get as any).mockResolvedValueOnce(
        // provider
        Promise.reject({ response: { data: { message: 'Invalid ID' }, status: 400 } })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: '1'
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
    })

    it('should return the expected status', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return expected body', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('if getting milestones returned an error', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // project
        Promise.resolve({ data: projectTestData.sampleProject })
      )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // milestones
          Promise.reject({
            response: { data: { message: projectTestData.sampleError }, status: 400 }
          })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: '1'
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
    })

    it('should return the expected status', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return expected body', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', projectTestData.sampleError)
    })
  })

  describe('if there are no milestones', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // project
        Promise.resolve({ data: projectTestData.sampleProject })
      )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // milestones
          Promise.resolve({ data: [] })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: '1'
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
    })

    it('should return the expected status', () => {
      expect(response.statusCode).toBe(404)
    })

    it('should return expected body', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'No milestone found')
    })
  })

  describe('if there is no active sprint', () => {
    beforeAll(async () => {
      ;(axios as any).mockResolvedValueOnce(
        // project
        Promise.resolve({ data: projectTestData.sampleProject })
      )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // milestones
          Promise.resolve({ data: projectTestData.sampleMilestone })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: '1'
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
    })

    it('should return status of 404', () => {
      expect(response.statusCode).toBe(404)
    })

    it('should return expected body', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'No active sprint found')
    })
  })

  describe('if getting issues returned an error', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
        .mockResolvedValueOnce(
          // issues
          Promise.reject({
            response: { data: { message: projectTestData.sampleError }, status: 400 }
          })
        )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // milestones
          Promise.resolve({ data: sampleMilestoneWithActiveSprint })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: '1'
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
    })

    it('should return the expected status', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return expected body', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', projectTestData.sampleError)
    })
  })

  describe('if there are no issues', () => {
    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
        .mockResolvedValueOnce(
          // issues
          Promise.resolve({ data: [] })
        )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // milestones
          Promise.resolve({ data: sampleMilestoneWithActiveSprint })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: '1'
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
    })

    it('should return stauts of 404', () => {
      expect(response.statusCode).toBe(404)
    })

    it('should return expected body', () => {
      const data = response._getJSONData()
      expect(data).toHaveProperty('message', 'No issues found')
    })
  })

  describe('if there is project, provider, milestones, active sprint and issues', () => {
    // need to modify the expected response because the date is dynamically set to the current date
    // as we see in line 227
    const expectedResponse = projectTestData.sampleGetActiveSprintData

    const date1 = new Date('5/27/2022').getTime()
    const date2 = new Date().getTime()
    const diffTime = Math.abs(date2 - date1)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    const timeArray = []
    const datesArray = []

    for (let i = 0; i < diffDays; i++) {
      timeArray.push(0)
      const result = new Date(date1)
      result.setDate(result.getDate() + i + 1)
      datesArray.push(result.toLocaleDateString())
    }

    expectedResponse.data.actual.push.apply(expectedResponse.data.actual, timeArray)
    expectedResponse.data.estimated.push.apply(expectedResponse.data.estimated, timeArray)
    expectedResponse.dates.push.apply(expectedResponse.dates, datesArray)

    beforeAll(async () => {
      ;(axios as any)
        .mockResolvedValueOnce(
          // project
          Promise.resolve({ data: projectTestData.sampleProject })
        )
        .mockResolvedValueOnce(
          // issues
          Promise.resolve({ data: projectTestData.sampleIssues })
        )
      ;(axios.get as any)
        .mockResolvedValueOnce(
          // provider
          Promise.resolve({ data: projectTestData.sampleProvider })
        )
        .mockResolvedValueOnce(
          // milestones
          Promise.resolve({ data: sampleMilestoneWithActiveSprint })
        )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: '1'
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
    })

    it('should return status of 200', () => {
      expect(response.statusCode).toBe(200)
    })

    it('should return expected body', () => {
      const data = response._getJSONData()
      expect(JSON.stringify(data)).toBe(JSON.stringify(expectedResponse))
    })
  })
})
