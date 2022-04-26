import { PrismaClient } from '@prisma/client'
import { Context } from '../utils/context'

class Controller {
  constructor(ctx: Context = { prisma: new PrismaClient() }) {}
}

module.exports = Controller
