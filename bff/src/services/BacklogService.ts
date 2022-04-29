require('dotenv').config()
import axios, { AxiosResponse, AxiosError } from 'axios'
import { ProviderInterface } from '../utils/interfaces'

const URL = process.env.BACKLOG_API_SERVICE

export default class BacklogService {
  // PROJECTS MICRO SERVICES

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

  // PROVIDER MICROSERVICES

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

  static async getProviders(user_id: number) {
    let data

    await axios({
      url: `${URL}/providers`,
      method: 'get',
      data: {
        user_id: user_id
      }
    })
      .then((response: AxiosResponse) => {
        data = response.data
      })
      .catch((error: AxiosError) => {
        data = error.message
      })
  }

  async getProviderById(id: number) {
    return await axios
      .get(`${URL}/providers/${id}`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return error.response
      })
  }

  // WILL CONNECT TO BACKLOG API (not microservice)

  async getIssues(space_key: String, api_key: string, milestone_id?: number) {
    let data
    let url = `https://${space_key}.backlog.com/api/v2/issues?apiKey=${api_key}${
      milestone_id ? `&milestoneId[]=${milestone_id}` : ''
    }`

    await axios.get(url).then((response: AxiosResponse) => {
      data = response.data
    })
    return data
  }

  async getMilestones(space_key: String, api_key: string, project_id: number) {
    let data
    await axios
      .get(
        `https://${space_key}.backlog.com/api/v2/projects/${project_id}/versions?apiKey=${api_key}`
      )
      .then((response: AxiosResponse) => {
        data = response.data
      })
    return data
  }

  static async backlogProjects(payload: any) {
    return await axios({
      baseURL: URL,
      url: '/backlog/projects',
      method: 'get',
      params: payload
    })
  }
}
