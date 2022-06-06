import AccountService from '../services/AccountService'
import { getUserInterface } from '../utils/interfaces'
import { errorWithCustomMessage } from '../utils/helpers'

export default class Controller {
  public async user(payload: getUserInterface) {
    try {
      return await AccountService.user(payload)
    } catch (error) {
      errorWithCustomMessage(403, { message: 'Unauthorized access' })
    }
  }
}
