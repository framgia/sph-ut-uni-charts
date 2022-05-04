// @ts-nocheck
import { ProviderAdd } from './interfaces/Provider'
import { Context } from '../utils/context'

class Provider {
  public async isProjectRegistered(data: ProviderAdd, ctx: Context) {
    return await ctx.prisma.project.findMany({
      where: {
        project_id: data.project_id,
        provider: { user_id: data.user_id }
      }
    })
  }

  public async add(data: ProviderAdd, ctx: Context) {
    const { project_name, project_key, project_id, user_id, api_key, name, space_key } = data

    return await ctx.prisma.provider.upsert({
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

  public async getProviders(user_id: number, ctx: Context) {
    return await ctx.prisma.provider.findMany({
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

  public async getProviderById(id: number, ctx: Context) {
    return await ctx.prisma.provider.findUnique({
      where: {
        id: id
      },
      include: {
        projects: true
      }
    })
  }
}

module.exports = Provider
