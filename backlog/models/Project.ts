// @ts-nocheck
import { GetProjectsInput } from '../interfaces/Project'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class Project {
  public static projectsWithParams = async (params: GetProjectsInput) => {
    const { filterProviderName = '', searchProvider = '', user_id } = params

    /**
     * Prisma has not supported pattern matching for "wildcard search" functionality.
     * Alternatives gives was to use "queryRaw" on it
     * https://github.com/prisma/prisma/discussions/3159
     */
    const projectIds = await prisma.$queryRaw<{ id: number }[]>`
      SELECT "id" FROM "Project"
      WHERE LOWER(name) LIKE ${`%${searchProvider ? searchProvider.toString().toLowerCase() : ''}%`}
    ;`

    return await prisma.project.findMany({
      where: {
        user_id,
        ...(searchProvider ? { id: { in: projectIds.map((row) => row.id) } } : {}),
        ...(filterProviderName
          ? {
              provider: {
                user_id,
                OR: {
                  name: {
                    equals: String(filterProviderName),
                    mode: 'insensitive'
                  }
                }
              }
            }
          : {})
      },
      include: { provider: true },
      orderBy: {
        name: 'asc'
      }
    })
  }
}

export default Project
