export interface IProject {
  id: number
  name: string
  key: string
  project_id: number
  provider_id: number
  created_at: Date
  updated_at: Date
}

export interface IProjectData {
  name: string
  key: string
  project_id: number
  provider_id: number
}

export interface InputRequest {
  query: { user_id: number }
  params: { id: string }
}

export interface GetProjectsInput {
  filterProviderName?: string
  searchProvider?: string
  page?: number
  user_id: number
}
