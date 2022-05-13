import axios from 'axios'
import { Request } from 'express'
import { rest } from 'msw'
import httpMocks from 'node-mocks-http'
import ProjectController from '../../controllers/ProjectController'
import { CustomTypedResponse } from '../../utils/interfaces'
import projectTestData from '../constants/projectTestData.json'
import testData from '../constants/activeSprintData.json'
import BacklogService from '../../services/BacklogService'
import { server } from '../../../jest.setup'

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

describe('Get Burndown chart data', () => {
  describe('When ID is not found or invalid', () => {
    it('Should return error if project_id is not found', async () => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: '00000'
        },
        query: {
          service: 'backlog'
        }
      })

      const response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
      const data = response._getData()
      expect(data).toHaveProperty('message', 'No Data Found')
    })

    it('Should return error if ID is invalid', async () => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: 'test'
        },
        query: {
          service: 'backlog'
        }
      })

      const response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
      const data = response._getData()
      expect(data).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('When service is not provided when making the request', () => {
    it('Should return error when no service is provided', async () => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: '1'
        }
      })

      const response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
      const data = response._getData()
      expect(data).toHaveProperty('message', 'Service information not provided.')
    })
  })

  describe('When service and ID is valid', () => {
    beforeEach(() => {
      server.use(
        rest.get('*/api/projects/:id', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(testData.projectsResponse))
        }),

        rest.get('*/api/providers/:id', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(testData.providersResponse))
        }),

        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(testData.milestonesResponse))
        }),

        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.json(testData.issuesResponse))
        })
      )
    })

    it('Should return active sprint dates, estimated sprint data and actual sprint data', async () => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/projects/:id/active-sprint-data',
        params: {
          id: '1'
        },
        query: {
          service: 'backlog'
        }
      })

      const response = httpMocks.createResponse()
      await projectController.getActiveSprintData(request, response)
      const res = response._getData()

      expect(res).toHaveProperty('dates')
      expect(res).toHaveProperty('data')
      expect(res).toBeTruthy()

      // Number of dates in x-axis of burn-down chart is 6
      // Similar with backlog's burn-down chart
      expect(res.dates).toHaveLength(6)
      expect(res.data).toHaveProperty('estimated')
      expect(res.data).toHaveProperty('actual')
      expect(res.data.estimated.length).toBeGreaterThan(0)
      expect(res.data.actual.length).toBeGreaterThan(0)
    })
  })
})
