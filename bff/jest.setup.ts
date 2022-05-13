import { setupServer } from 'msw/node'

export const server = setupServer()

beforeAll(() => {
  /*
  NOTE:
  set unhandled request to bypass
  since we are not mocking all requests and it is raising warnings
  removing it will not break the code, it just looks cleaner in terminal this way
  */

  server.listen({ onUnhandledRequest: 'bypass' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
