import BacklogService from '../services/BacklogService'
import { Request, Response } from 'express';

class ProviderController {
  static async add(req: Request, res: Response) {
    let result

    switch (req.body.provider) {
      case 'backlog':
        result = await BacklogService.add(req.body)
        break
      default:
        return res.status(400).send({ message: 'Invalid Provider' })
    }

    res.status(result.status).send(result.data)
  }
}

export default ProviderController
