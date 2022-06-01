import { Request, Response, NextFunction } from 'express'

import { client, CLIENT_ID } from '../utils/google'
import Controller from './Controller'
import UserValidation from '../validations/UserValdiation'
import User from '../models/User'

class UserController extends Controller {
  public static index = async (req: Request, res: Response): Promise<void> => {
    type iParam = { email: string }
    const payload = req.query as iParam
    const validationErrors = UserValidation.show(payload)

    if (validationErrors) {
      res.status(422).json(validationErrors)
      return
    }

    try {
      const result = await new User().model.findFirst({
        where: {
          email: payload.email
        },
        select: {
          id: true,
          email: true
        }
      })

      if (result) {
        res.send(result)
      } else {
        res.status(404).json({ message: 'Not found' })
      }
    } catch (error) {
      res.status(500).json({
        message: 'an internal server error occured',
        details: error
      })
    }
  }

  public static signIn = async (req: Request, res: Response): Promise<void> => {
    const user = new User()
    const userPayload = req.body
    const validationErrors = UserValidation.signIn(userPayload)

    if (validationErrors) {
      res.status(422).json(validationErrors)
      return
    }

    try {
      await user.model.upsert({
        where: { email: userPayload.email },
        update: { token_id: userPayload.token_id },
        create: {
          email: userPayload.email,
          token_id: userPayload.token_id,
          google_id: userPayload.google_id
        }
      })

      res.status(200).json({
        message: 'google signed in successfully'
      })
    } catch (error) {
      res.status(500).json({
        message: 'an internal server error occured',
        details: error
      })
    }
  }

  public static checkStatus = async (req: Request, res: Response): Promise<void> => {
    type checkStatusInputParameter = { email: string }

    const userPayload = req.query
    const validationErrors = UserValidation.checkAuthenticated(userPayload)

    if (validationErrors) {
      res.status(422).json(validationErrors)
      return
    }

    const user = new User()
    const result: any = await user.findByEmail((userPayload as checkStatusInputParameter).email)

    if (!result && !result?.token_id) {
      res.status(419).json({
        message: 'Session has already expired.'
      })
      return
    }

    try {
      const ticket = await client.verifyIdToken({
        idToken: result.token_id,
        audience: CLIENT_ID
      })
      const payload = ticket.getPayload()

      res.status(200).json({
        ...payload,
        token_id: result?.token_id
      })
    } catch (error) {
      res.status(419).json({
        message: 'Session has been expired'
      })
    }
  }

  public static signOut = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userPayload = req.body
    const validationErrors = UserValidation.signOut(userPayload)

    if (validationErrors) {
      res.status(422).json(validationErrors)
      return
    }

    const user = new User()
    await user.destroyToken(userPayload)

    res.status(201).json({
      message: 'The account was successfully signed out.'
    })
  }
}

export default UserController
