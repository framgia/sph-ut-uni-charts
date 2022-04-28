require('dotenv').config()
import axios, { AxiosResponse } from 'axios'

const URL = process.env.ACCOUNT_API_SERVICE

export default class AccountService {
  static async login(payload: any) {
    return await axios
      .post(`${URL}/users/signIn`, { ...payload })
      .then((response: AxiosResponse) => {
        return response
      })
      .catch((error) => {
        return error.response
      })
  }

  static async logout(payload: any) {
    return axios({
      url: `${URL}/users/signOut`,
      method: 'post',
      data: payload
    }).then((response: AxiosResponse) => {
      return response.data
    })
  }

  static async checkActiveStatus(email: string) {
    return axios({
      url: `${URL}/users/check-status`,
      method: 'get',
      params: {
        email: email
      }
    }).then((response: AxiosResponse) => {
      return response.data
    })
  }
}
