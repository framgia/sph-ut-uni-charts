require('dotenv').config()
import httpMocks from 'node-mocks-http'

import UserController from '../../controllers/UserController'
import { IUser } from '../../models/interface/User'
import { TESTING_GOOGLE_TOKEN_ID } from '../../utils/google'
import { prismaMock } from '../../utils/singleton'

let req: any, res: any, next: any

const userMock: IUser = {
  id: 2,
  email: 'john2.doe@test.com',
  token_id: TESTING_GOOGLE_TOKEN_ID || 'token_id',
  google_id: 'google_id_rand',
  created_at: new Date(),
  updated_at: new Date()
}

beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = null
})

describe('When fetching user details', () => {
  it('should return user info if input is valid', async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: 1,
      email: 'test@gmail.com',
      token_id: 'tokenid',
      google_id: 'googleid',
      created_at: new Date(),
      updated_at: new Date()
    })
    req.query = { email: 'test@gmail.com' }
    await UserController.index(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._getData()).toMatchObject({
      id: 1,
      email: 'test@gmail.com'
    })
  })

  it('should return user info if input is valid', async () => {
    req.query = { email: 123 }
    await UserController.index(req, res)
    expect(res.statusCode).toBe(422)
    expect(res._getJSONData()).toMatchObject([
      { message: 'Incorrect type. Expected string.', parameter: 'email', value: 123 }
    ])
  })

  it('should have 404 response if no data from DB', async () => {
    req.query = { email: 'test@gmail.com' }
    await UserController.index(req, res)
    expect(res.statusCode).toBe(404)
    expect(res._getJSONData()).toMatchObject({ message: 'Not found' })
  })
})

describe('UserController.signIn', () => {
  beforeEach(() => {
    req.body = {
      email: userMock.email,
      google_id: userMock.google_id,
      token_id: userMock.token_id
    }
  })

  it('should have a signIn function', () => {
    expect(typeof UserController.signIn).toBe('function')
  })

  it('should return a response contains status 200 with a message [success case]', async () => {
    await UserController.signIn(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toMatchObject({
      message: 'google signed in successfully'
    })
  })

  it('should return a response contains status 422 with a payload object [failed case]', async () => {
    req.body = {
      email: 'new@gmailcom',
      google_id: null
    }

    await UserController.signIn(req, res)

    expect(res.statusCode).toBe(422)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toMatchObject([
      {
        parameter: 'email',
        value: 'new@gmailcom',
        message: 'The email value is invalid.'
      },
      { parameter: 'token_id', message: 'Required value.' },
      { parameter: 'google_id', value: null, message: 'Required value.' }
    ])
  })
})

const testIfTokenIsSpecified = TESTING_GOOGLE_TOKEN_ID ? describe : describe.skip
testIfTokenIsSpecified('UserController.checkStatus and signOut', () => {
  beforeEach(() => {
    req.query = {
      email: userMock.email
    }
    req.body = {
      email: userMock.email,
      token_id: TESTING_GOOGLE_TOKEN_ID
    }
  })

  it('should return a response contains status 200 with a body object [success case]', async () => {
    prismaMock.user.findFirst.mockResolvedValue(userMock)
    await UserController.checkStatus(req, res)

    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toMatchObject({
      iss: expect.any(String),
      azp: expect.any(String),
      aud: expect.any(String),
      sub: expect.any(String),
      email: expect.any(String),
      email_verified: expect.any(Boolean),
      at_hash: expect.any(String),
      name: expect.any(String),
      picture: expect.any(String),
      given_name: expect.any(String),
      family_name: expect.any(String),
      locale: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
      jti: expect.any(String)
    })
  })

  it('should return a response contains status 200 with a body object [success case]', async () => {
    prismaMock.user.findFirst.mockResolvedValue(userMock)
    await UserController.checkStatus(req, res)

    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
  })

  it('should have a signOut function', () => {
    expect(typeof UserController.signOut).toBe('function')
  })

  it('should empty the token_id column upon calling signOut functionality', async () => {
    prismaMock.user.create.mockResolvedValue(userMock)

    await UserController.signOut(req, res, next)
    prismaMock.user.findFirst.mockResolvedValue({ ...userMock, token_id: null })

    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toMatchObject({
      message: 'The account was successfully signed out.'
    })
  })
})
