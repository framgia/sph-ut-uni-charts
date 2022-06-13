import { rest } from 'msw'
import BacklogService from '../../../services/BacklogService'
import { server } from '../../../../jest.setup'

const backlogService = new BacklogService()

describe('When using getDeveloperIcon() function', () => {
  let developer: any

  describe('if it has correct namespace, developer ID and key', () => {
    it('should return expected body', async () => {
      server.use(
        rest.get('*/api/v2/users/*', (req, res, ctx) => {
          return res(ctx.json('icon'))
        })
      )

      developer = await backlogService.getDeveloperIcon('namespace', 'key', 111)
      expect(developer).toBe('data:application/json;base64,Imljb24i')
    })
  })

  describe('if it has incorrect key', () => {
    const errors = [
      {
        message: 'Authentication failure.',
        code: 11,
        moreInfo: ''
      }
    ]

    beforeEach(async () => {
      server.use(
        rest.get('*/api/v2/users/*', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(401))
        })
      )

      try {
        await backlogService.getDeveloperInfo('namespace', 'key', 111)
      } catch (error: any) {
        developer = JSON.parse(error.message)
      }
    })

    it('should throw an error with status of 401', () => {
      expect(developer.status).toBe(401)
    })

    it('should throw an error with expected error message', () => {
      expect(developer).toHaveProperty('errors', errors)
    })
  })

  describe('if it has incorrect developer ID', () => {
    const errors = [
      {
        message: 'Invalid Request. Cannot parse parameter userId as Int: For input string: "111"',
        code: 7,
        moreInfo: ''
      }
    ]

    beforeEach(async () => {
      server.use(
        rest.get('*/api/v2/users/*', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(400))
        })
      )

      try {
        await backlogService.getDeveloperInfo('namespace', 'key', 111)
      } catch (error: any) {
        developer = JSON.parse(error.message)
      }
    })

    it('should throw an error with status of 400', () => {
      expect(developer.status).toBe(400)
    })

    it('should throw an error with expected error message', () => {
      expect(developer).toHaveProperty('errors', errors)
    })
  })

  describe('if it has incorrect namespace', () => {
    const errors = [{ message: 'Incorrect namespace' }]
    beforeEach(async () => {
      server.use(
        rest.get('*/api/v2/users/*', (req, res, ctx) => {
          return res(ctx.status(404))
        })
      )

      try {
        await backlogService.getDeveloperInfo('namespace', 'key', 111)
      } catch (error: any) {
        developer = JSON.parse(error.message)
      }
    })

    it('should throw an error with status of 404', () => {
      expect(developer.status).toBe(404)
    })

    it('should throw an error "Incorrect namespace" as error message', () => {
      expect(developer).toHaveProperty('errors', errors)
    })
  })
})
