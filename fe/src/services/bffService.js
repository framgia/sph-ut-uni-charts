import axios from 'axios'

const URL = 'http://localhost:11000/api'

export const getIssues = async (project_id, provider) => {
  let data
  await axios
    .get(`${URL}/issues/${project_id}?service=${provider}`)
    .then((response) => {
      data = response.data
    })

  return data
}
