import BacklogService from '../services/BacklogService'
import { Request, Response } from 'express'

const Service = new BacklogService()
class BacklogController {
  public async getList(req: Request, res: Response) {
    try {
      const result = await Service.getProjects(req.query.apikey)
      return res.send(result.data)
    } catch (error: any) {
      return res.status(error.response.status).send(error.response.data)
    }
  }
}

export default BacklogController
