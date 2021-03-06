export interface ProviderAdd {
  user_id: number
  name: string
  provider: string
  space_key: string
  api_key: string
  project_key: string
  project_name: string
  project_id: number
}

export interface IProvider {
  id: number
  user_id: number
  name: string
  space_key: string
  api_key: string
  created_at: Date
  updated_at: Date
}

export interface InputRequest {
  query: { user_id: number }
  params: { id: string }
}
