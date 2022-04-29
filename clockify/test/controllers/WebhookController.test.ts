import httpMocks from 'node-mocks-http'
import axios from 'axios'
import WebhookController from '../../controllers/WebhookController'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Webhook Controller', () => {
  let req: { body: any }, res: { status: any; send: () => any }, Controller: any

  const getProjectKeyMock = jest.fn()

  beforeEach(() => {
    req = httpMocks.createRequest()
    res.status = jest.fn().mockReturnValue(200)
    res.send = jest.fn().mockReturnValue('Success')
    Controller = new WebhookController()
    Controller.getProjectKey = getProjectKeyMock
  })

  it('should be', async () => {
    // Arrange
    req.body = {
      id: '626a40f71f12855370937b3c',
      description: 'UT_UNICHARTS-1 Sample',
      userId: '5d77151c26631d5040088b77',
      billable: false,
      projectId: null,
      timeInterval: {
        start: '2022-04-28T07:23:35Z',
        end: '2022-04-28T07:23:38Z',
        duration: 'PT1H'
      },
      workspaceId: '5d77151d26631d5040088b78',
      isLocked: false,
      hourlyRate: null,
      costRate: null,
      customFieldValues: [],
      currentlyRunning: false,
      project: null,
      task: null,
      user: {
        id: '5d77151c26631d5040088b77',
        name: 'Jeremiah Caballero',
        status: 'ACTIVE'
      },
      tags: []
    }

    // get the backlog id from the clockify title
    // getProjectKeyMock.mockReturnValueOnce

    // Action
    await Controller.getData(req, res)

    // Assert
    // expect(getProjectKey).toBe('UT_UNICHARTS-1 Sample')
  })
})
