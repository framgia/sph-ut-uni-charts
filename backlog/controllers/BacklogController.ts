import BacklogService from '../services/BacklogService'
import Provider from '../models/Provider'
import { Request, Response } from 'express'

const Service = new BacklogService()
const ProviderModel = new Provider()
class BacklogController {
  public async getList(req: Request, res: Response) {
    let payload = req.query
    if (req.query.providerId) {
      const provider = await ProviderModel.getProviderById(Number(req.query.providerId))
      payload = { apiKey: provider?.api_key }
    }
    try {
      const result = await Service.getProjects(payload)
      return res.send(result.data)
    } catch (error: any) {
      console.log({ error })
      return res.status(error.response.status ?? 500).send(error?.response?.data ?? error)
    }
  }
}

export default BacklogController
