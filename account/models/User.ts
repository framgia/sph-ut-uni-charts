import { UserSignIn, UserSignOut } from './interface/User'
import Model from './Model'

class User extends Model {
  constructor() {
    super('user')
  }

  async insertOrUpdateUser(user: UserSignIn) {
    return await this.model.upsert({
      where: { email: user.email },
      create: {
        email: user.email,
        token_id: user.token_id,
        google_id: user.google_id
      },
      update: { token_id: user.token_id }
    })
  }

  async findByEmail(email: string) {
    return await this.model.findFirst({
      where: { email: email }
    })
  }

  async destroyToken(data: UserSignOut) {
    return await this.model.updateMany({
      where: {
        email: data.email,
        token_id: data.token_id
      },
      data: { token_id: null }
    })
  }
}

export default User
