import AccountService from '../services/AccountService'
import { Request, Response } from 'express'
import { getUserInterface } from '../utils/interfaces'

export type ResponseError = {
  message: string
  response: {
    status: number
    message: string
    data: string
  }
}

export default class AccountController {
  static async user(req: Request, res: Response) {
    try {
      const result = await AccountService.user(req.query as getUserInterface)
      res.status(200).json(result)
    } catch (error) {
      const output = error as ResponseError
      if (!output?.response) {
        return res.status(500).json({
          message: 'an internal error occured'
        })
      }

      res.status(output.response.status).json({
        message: output.response.message,
        data: output.response.data
      })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AccountService.login(req.body)
      res.status(200).send(result)
    } catch (error) {
      const output = error as ResponseError
      if (!output?.response) {
        return res.status(500).json({
          message: 'an internal error occured'
        })
      }

      res.status(output.response.status).json({
        message: output.response.message,
        data: output.response.data
      })
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const result = await AccountService.logout(req.body)
      res.status(200).json(result)
    } catch (error) {
      const output = error as ResponseError
      if (!output?.response) {
        return res.status(500).json({
          message: 'an internal error occured'
        })
      }

      res.status(output.response.status).json({
        message: output.response.message,
        data: output.response.data
      })
    }
  }

  static async checkActiveStatus(req: Request, res: Response) {
    type InputParameter = { email: string }

    try {
      const result = await AccountService.checkActiveStatus((req.query as InputParameter).email)
      res.status(200).json(result)
    } catch (error) {
      const output = error as ResponseError
      if (!output?.response) {
        return res.status(500).json({
          message: 'an internal error occured'
        })
      }

      res.status(output.response.status).json({
        message: output.response.message,
        data: output.response.data
      })
    }
  }
}
