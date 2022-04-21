const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class Provider {
  static async isProjectRegistered(data) {
    return await prisma.project.findMany({
      where: {
        project_id: data.project_id,
        provider: { user_id: data.user_id }
      }
    })
  }

  static async add(data) {
    const { project_name, project_key, project_id, user_id, api_key, provider, space_key } = data

    return await prisma.provider.upsert({
      where: {
        user_id_api_key: {
          user_id,
          api_key
        }
      },
      update: {
        projects: {
          create: {
            name: project_name,
            key: project_key,
            project_id: project_id
          }
        }
      },
      create: {
        user_id: user_id,
        name: provider,
        space_key: space_key,
        api_key: api_key,
        projects: {
          create: {
            name: project_name,
            key: project_key,
            project_id: project_id
          }
        }
      }
    })
  }
}

module.exports = Provider
