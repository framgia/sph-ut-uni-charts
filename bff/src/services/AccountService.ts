require('dotenv').config()
import axios, { AxiosResponse } from 'axios'

const URL = process.env.ACCOUNT_API_SERVICE

export default class AccountService {
  static async login(payload: any) {
    return axios({
      url: `${URL}/users/signIn`,
      method: 'post',
      data: payload
    }).then((response: AxiosResponse) => {
      return response.data
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
