const Provider = require('../models/Provider')
const Validation = require('../validations/ProviderValidation')
import Controller from './Controller'
import { Context } from '../utils/context'
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

let ctx: Context = { prisma: new PrismaClient() }
const prisma = new PrismaClient()

class ProviderController extends Controller {
  public async add(req: Request, res: Response) {
    const ProviderModel = new Provider()
    const errors = Validation.add(req.body)

    if (errors) return res.status(422).send(errors)

    const hasProjectRegistered = await ProviderModel.isProjectRegistered(req.body, ctx)

    if (hasProjectRegistered.length)
      return res
        .status(400)
        .send([{ message: `You already registered this project: ${req.body.project_name}` }])

    const provider = await ProviderModel.add(req.body, ctx)

    return res.send(provider)
  }

  public async getProviders(req: Request, res: Response) {
    if (/[a-zA-z]/.test(req.body.user_id)) {
      res.send({
        message: 'Invalid User ID'
      })
    } else {
      const ProviderModel = new Provider()
      const providers = await ProviderModel.getProviders(Number(req.body.user_id), ctx)

      res.send(providers)
    }
  }

  async getProviderById(req: Request, res: Response) {
    if (/[^0-9]/.test(req.params.id)) {
      // non-numerical id
      res.status(400).json({ message: 'Invalid ID' })
    } else {
      const provider = await prisma.provider.findUnique({
        where: {
          id: Number(req.params.id)
        }
      })

      if (!provider) {
        res.status(404).json({ message: 'No Provider Found' })
      } else {
        res.send(provider)
      }
    }
  }
}

export default ProviderController
