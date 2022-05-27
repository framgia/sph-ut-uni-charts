import prisma from '../utils/client'
import { ProviderAdd } from '../interfaces/Provider'

class Provider {
  public async isProjectRegistered(data: ProviderAdd) {
    return await prisma.project.findMany({
      where: {
        project_id: data.project_id,
        provider: { user_id: data.user_id }
      }
    })
  }

  public async add(data: ProviderAdd) {
    const { project_name, project_key, project_id, user_id, api_key, name, space_key } = data

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
        user_id,
        name,
        space_key,
        api_key,
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

  public async getProviders(user_id: number) {
    return await prisma.provider.findMany({
      where: {
        user_id
      },
      select: {
        id: true,
        name: true,
        space_key: true
      }
    })
  }

  public async getProviderById(payload: { user_id: number; id: number }) {
    return await prisma.provider.findFirst({
      where: {
        id: payload.id,
        user_id: payload.user_id
      },
      include: {
        projects: true
      }
    })
  }
}

export default Provider
