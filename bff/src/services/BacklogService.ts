require('dotenv').config()
import axios, { AxiosResponse } from 'axios'

const URL = process.env.BACKLOG_API_SERVICE

export default class BacklogService {
  static async backlogProjects(payload: any) {
    return await axios({
      baseURL: URL,
      url: '/backlog/projects',
      method: 'get',
      params: payload
    })
  }

  async getProjects() {
    let data

    await axios({
      url: `${URL}/projects`,
      method: 'get'
    }).then((response: AxiosResponse) => {
      data = response.data
    })
    return data
  }

  async getProjectById(id: String) {
    let data

    await axios({
      url: `${URL}/projects/${id}`,
      method: 'get'
    }).then((response: AxiosResponse) => {
      data = response.data
    })

    return data
  }

  static async add(payload: any) {
    return await axios
      .post(`${URL}/providers/add`, { ...payload })
      .then((response: AxiosResponse) => {
        return response
      })
      .catch((error) => {
        return error.response
      })
  }
}
