import axios from 'axios'

const URL = process.env.NEXT_PUBLIC_BFF_API

export const getIssues = async (project_id, provider) => {
  let data
  await axios
    .get(`${URL}issues/${project_id}?service=${provider}`)
    .then((response) => {
      data = response.data
    })

  return data
}

export const getProviders = async () => {
  return await axios.get(`${URL}providers/`)
}

export const getBacklogProjects = async (payload) => {
  return await axios.get(`${URL}backlog/projects`, { params: payload })
}

export const addProvider = async (payload) => {
  return await axios.post(`${URL}providers/add`, payload)
}
