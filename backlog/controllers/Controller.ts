import { PrismaClient } from '@prisma/client'
import { Context } from '../utils/context'

export default class Controller {
  constructor(ctx: Context = { prisma: new PrismaClient() }) {}
}
