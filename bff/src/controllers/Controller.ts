import AccountService from '../services/AccountService'
import { getUserInterface } from '../utils/interfaces'

export default class Controller {
  public async user(payload: getUserInterface) {
    try {
      return await AccountService.user(payload)
    } catch (error) {
      return { errors: { message: 'Unauthorized access' }, status: 403 }
    }
  }
}
