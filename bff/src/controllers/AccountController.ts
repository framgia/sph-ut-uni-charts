import AccountService from '../services/AccountService'
import { Request, Response, ErrorRequestHandler } from 'express'

export type ResponseError = {
  status: number
  message: string
  response: {
    status: number
    message: string
  }
}

export default class AccountController {
  static async login(req: Request, res: Response) {
    try {
      const result = await AccountService.login(req.body)
      res.status(200).send(result)
    } catch (error) {
      const output = error as ResponseError
      res.status(output.response.status).json(output)
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const result = await AccountService.logout(req.body)
      res.status(200).json(result)
    } catch (error) {
      const output = error as ResponseError
      res.status(500).json({
        message: output.message
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
      res.status(output.response.status).json({
        message: output.message
      })
    }
  }
}
