export interface IUser {
  id: number
  email: string
  token_id: string
  google_id: string
  created_at: Date
  updated_at: Date
}

export interface UserSignOut {
  email: string
  token_id: string
}

export interface UserSignIn {
  email: string
  google_id: string
  token_id: string
}
