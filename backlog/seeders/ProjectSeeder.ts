import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

import { IProject } from '../interfaces/Project'
import projectTest from './const/project.json'

const prisma = new PrismaClient()

class ProjectSeeder {
  public data: IProject[] = []

  public run = async () => {
    const providers = await prisma.provider.findMany({})

    this.data = await prisma.$transaction(
      Array(50)
        .fill(0)
        .map((provider) =>
          prisma.project.create({
            data: {
              user_id: 1,
              name: faker.random.arrayElement(projectTest.prefix) + faker.company.bsNoun(),
              key: `key_${faker.random.alphaNumeric(20)}`,
              project_id: faker.datatype.number(99999),
              provider_id: providers[Math.floor(Math.random() * providers.length)].id
            }
          })
        )
    )
  }

  public undoChanges = async () => {
    await prisma.project.deleteMany({
      where: {
        id: {
          in: this.data.map((data) => data.id)
        }
      }
    })
  }
}

export default ProjectSeeder
