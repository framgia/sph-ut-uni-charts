// @ts-nocheck
import httpMocks from 'node-mocks-http'
import ProjectController from '../../controllers/ProjectController'
import { Request, Response } from 'express'
import { prismaMock } from '../../utils/singleton'
import { IProjectData } from 'models/interfaces/Project'
import { testData } from '../const/project'

describe('When getProjectById', () => {
  interface TypedResponse extends Response {
    statusCode: any
    _getData: () => any
  }

  let req: Request
  let res: TypedResponse
  let Controller: any

  const mockedProjectResponse = {
    id: 999,
    name: 'Backlog',
    key: 'UNI-CHART',
    project_id: 99846,
    provider_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    Controller = new ProjectController()
  })

  describe('When calling getProjects function', () => {
    let payload: IProjectData[]

    beforeEach(async () => {
      payload = testData.map(({ created_at, updated_at, ...rest }) => rest)
    })

    describe('when fetching projects is successful', () => {
      beforeEach(async () => {
        prismaMock.project.findMany.mockResolvedValue(testData)

        const { getProjects } = new ProjectController()
        await getProjects(req, res)
      })

      it('should return status 200', () => {
        expect(res.statusCode).toBe(200)
      })

      it('should return the expected body object', () => {
        expect(res._getJSONData()).toMatchObject(payload)
      })

      it('should return the expected array length of three datas', () => {
        const data = res._getJSONData()
        expect(data.length).toBe(3)
      })
    })

    describe('when fetching projects with provider filter argument', () => {
      beforeEach(async () => {
        prismaMock.project.findMany.mockResolvedValue([testData[0]])

        const { getProjects } = new ProjectController()
        req.body = { providerFitler: 'Backlog' }
        await getProjects(req, res)
      })

      it('should have an argument "providerFitler"', () => {
        expect(req.body.providerFitler).not.toBe(undefined)
      })

      it('should return the expected body object', () => {
        expect(res._getJSONData()).toMatchObject([payload[0]])
      })

      it('should return the expected array length of one datas out of three', () => {
        const data = res._getJSONData()
        expect(data.length).toBe(1)
      })
    })

    describe('when fetching projects with search argument', () => {
      beforeEach(async () => {
        prismaMock.project.findMany.mockResolvedValue(testData.filter((d, i) => i !== 1))

        const { getProjects } = new ProjectController()
        req.body = { searchProvider: 'lo' }
        await getProjects(req, res)
      })

      it('should have an argument "searchProvider"', () => {
        expect(req.body.searchProvider).not.toBeNull()
      })

      it('should return the expected body object', () => {
        expect(res._getJSONData()).toMatchObject(payload.filter((d, i) => i !== 1))
      })

      it('should return the expected array length of two datas out of three', () => {
        const data = res._getJSONData()
        expect(data.length).toBe(2)
      })
    })

    it('should respond "Invalid ID" as validation error if id is string', async () => {
      req.params = { id: 'test' }
      await Controller.getProjectById(req, res)
      const data = res._getData()
      expect(data).toHaveProperty('message', 'Invalid ID')
    })

    it('should respond "No Data Found" if no data in DB', async () => {
      /* @ts-ignore */
      req.params = { id: 99999999999999 }
      await Controller.getProjectById(req, res)
      const data = res._getData()
      expect(data).toHaveProperty('message', 'No Data Found')
    })

    it('should responed project object', async () => {
      prismaMock.project.findUnique.mockResolvedValue(mockedProjectResponse)

      /* @ts-ignore */
      req.params = { id: 999 }
      await Controller.getProjectById(req, res)
      const data = res._getData()

      expect(data).toMatchObject(mockedProjectResponse)
    })

    it('should fetch array of objects', async () => {
      prismaMock.project.findMany.mockResolvedValue([mockedProjectResponse])

      await Controller.getProjects(req, res)
      const data = res._getJSONData()
      expect(data).toMatchObject([
        {
          id: 999,
          name: 'Backlog',
          key: 'UNI-CHART',
          project_id: 99846,
          provider_id: 1
        }
      ])
    })

    it('should return error message if ID does not exist', async () => {
      prismaMock.project.findUnique.mockResolvedValue(null)
      req.params = {
        id: '111111'
      }
      await Controller.deleteProjectById(req, res)
      const data = res._getData()
      expect(data).toHaveProperty('message', 'ID does not exist')
    })

    test('should return error message if id is not valid', async () => {
      req.params = { id: 'test' }
      await Controller.deleteProjectById(req, res)
      const data = res._getData()
      expect(data).toHaveProperty('message', 'Invalid ID')
    })
  })
})
