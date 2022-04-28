import { Prisma } from '@prisma/client'

import prisma from '../utils/client'
import { ModelNames } from '../utils/modelProps'

class Model {
  model: Prisma.UserDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>

  constructor(model: ModelNames) {
    this.model = prisma[model]
  }
}

export default Model
