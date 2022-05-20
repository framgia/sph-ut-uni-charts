import Provider from '../models/Provider'
import Validation from '../validations/ProviderValidation'
import BacklogService from '../services/BacklogService'
// import Controller from './Controller'
import { Context } from '../utils/context'
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const Service = new BacklogService()
const ProviderModel = new Provider()
// let ctx: Context = { prisma: new PrismaClient() }

class ProviderController {
  ctx: Context

  constructor(ctx = { prisma: new PrismaClient() }) {
    this.ctx = ctx
  }

  public async add(req: Request, res: Response) {
    let payload = req.body

    const errors = Validation.add(payload)
    if (errors) return res.status(422).send(errors)

    if (payload.id) {
      const provider = await ProviderModel.getProviderById(Number(payload.id), this.ctx)
      payload = { ...payload, ...provider }
    }

    if (!payload.space_key) {
      const space = await Service.getSpace({ apiKey: payload.api_key })
      payload = { ...payload, space_key: space.data.spaceKey }
    }

    const project = await Service.getProject({
      api_key: payload.api_key,
      projectIdOrKey: payload.project_id
    })
    payload = { ...payload, project_key: project.data.projectKey, project_name: project.data.name }

    const hasProjectRegistered = await ProviderModel.isProjectRegistered(payload, this.ctx)

    if (hasProjectRegistered.length)
      return res
        .status(400)
        .send([{ message: `You already registered this project: ${payload.project_name}` }])

    const provider = await ProviderModel.add(payload, this.ctx)

    return res.send(provider)
  }

  public async getProviders(req: Request, res: Response) {
    const errors = Validation.getList(req.query)
    if (errors) return res.status(422).send(errors)

    const providers = await ProviderModel.getProviders(Number(req.query.user_id), this.ctx)
    return res.send(providers)
  }

  async getProviderById(req: Request, res: Response) {
    if (/[^0-9]/.test(req.params.id)) {
      res.status(400).json({ message: 'Invalid ID' })
    } else {
      const provider = await ProviderModel.getProviderById(Number(req.params.id), this.ctx)

      if (!provider) {
        res.status(404).json({ message: 'No Provider Found' })
      } else {
        res.send(provider)
      }
    }
  }
}

export default ProviderController
