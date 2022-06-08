import { PrismaClient } from '@prisma/client'

import { IProvider } from '../interfaces/Provider'
import providerTest from './const/provider.json'

const prisma = new PrismaClient()

class ProviderSeeder {
  public data: IProvider[] = []
  public existingData: (IProvider | null)[] = []

  public run = async () => {
    this.existingData = await prisma.$transaction(
      providerTest.data.map((provider) =>
        prisma.provider.findFirst({
          where: {
            AND: {
              user_id: provider.user_id,
              api_key: provider.api_key
            }
          }
        })
      )
    )

    const filteredList = providerTest.data.filter(
      (data) =>
        !this.existingData.find(
          (filteredData) =>
            filteredData?.api_key === data.api_key && filteredData?.user_id === data.user_id
        )
    )

    this.data = await prisma.$transaction(
      filteredList.map((provider) =>
        prisma.provider.create({
          data: {
            ...provider,
            created_at: new Date(),
            updated_at: new Date()
          }
        })
      )
    )
  }

  public sortedData = () => this.data.sort((a, b) => (a.id > b.id ? 1 : -1))

  public undoChanges = async () => {
    await prisma.provider.deleteMany({
      where: {
        id: {
          in: this.data.map((data) => data.id)
        }
      }
    })
  }
}

export default ProviderSeeder
