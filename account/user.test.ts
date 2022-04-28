import { PrismaClient } from '@prisma/client'
import httpMocks from 'node-mocks-http'

import UserController from './controllers/UserController'

let req: any, res: any, next: any, prisma: any
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = null
  prisma = new PrismaClient()
})

describe('UserController.signIn - success scenario', () => {
  // let last_updated = null

  beforeEach(() => {
    req.body = {
      email: 'new@gmail.com',
      google_id: 'newIds@!',
      token_id: 'sample_token'
    }
  })

  it('should have a signIn function', () => {
    expect(typeof UserController.signIn).toBe('function')
  })

  it('should insert data to DB if not existed', async () => {
    await UserController.signIn(req, res, next)

    // checking database
    const data = await prisma.user.findFirst({
      where: { email: req.body.email }
    })
    // last_updated = data?.token_id

    expect(data).not.toBeNull()
    expect(data).toMatchObject({
      email: 'new@gmail.com',
      token_id: 'sample_token',
      google_id: 'newIds@!'
    })
  })

  // it('should update updated_at column if data existed', async () => {
  //   await UserController.signIn(req, res, next)

  //   // checking database
  //   const data = await prisma.user.findFirst({
  //     where: { email: req.body.email }
  //   });

  //   expect(data?.updated_at).not.toEqual(last_updated);
  // });

  // it('should return HTTP response 200', async () => {
  //   await UserController.signIn(req, res, next)
  //   expect(res.statusCode).toBe(200)
  //   expect(res._isEndCalled()).toBeTruthy()
  // })

  // it('should return json body in response', async () => {
  //   await UserController.signIn(req, res, next)
  //   expect(res._getJSONData()).toMatchObject({
  //     message: 'google signed in successfully',
  //     data: {
  //       email: req.body.email,
  //       token_id: req.body.token_id,
  //       google_id: req.body.google_id
  //     }
  //   })
  // })
})

// describe('UserController.signIn - failed scenario', () => {
//   beforeEach(() => {
//     req.body = {
//       email: 'new@gmailcom',
//       google_id: null
//     }
//   })

//   it('should return HTTP response 422 if have validation errors', async () => {
//     await UserController.signIn(req, res, next)
//     expect(res.statusCode).toBe(422)
//     expect(res._isEndCalled()).toBeTruthy()
//   })

//   it('should return json body in response if have validation errors', async () => {
//     await UserController.signIn(req, res, next)
//     expect(res._getJSONData()).toMatchObject([
//       {
//         parameter: 'email',
//         value: 'new@gmailcom',
//         message: 'The email value is invalid.'
//       },
//       { parameter: 'token_id', message: 'Required value.' },
//       { parameter: 'google_id', value: null, message: 'Required value.' }
//     ])
//   })
// })
