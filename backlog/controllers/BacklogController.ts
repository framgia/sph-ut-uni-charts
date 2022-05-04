import BacklogService from '../services/BacklogService'
import { Context } from '../utils/context'
import { PrismaClient } from '@prisma/client'
const Provider = require('../models/Provider')
import { Request, Response } from 'express'

let ctx: Context = { prisma: new PrismaClient() }
const Service = new BacklogService()
const ProviderModel = new Provider()
class BacklogController {
  public async getList(req: Request, res: Response) {
    let payload = req.query
    if (req.query.providerId) {
      const { api_key } = await ProviderModel.getProviderById(Number(req.query.providerId), ctx)
      payload = { apiKey: api_key }
    }
    try {
      const result = await Service.getProjects(payload)
      return res.send(result.data)
    } catch (error: any) {
      return res.status(error.response.status ?? 500).send(error)
    }
  }
}

export default BacklogController
