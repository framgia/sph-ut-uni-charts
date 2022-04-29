import { OAuth2Client } from 'google-auth-library'

export const TESTING_GOOGLE_TOKEN_ID = process.env.TESTING_GOOGLE_TOKEN_ID
export const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
export const client = new OAuth2Client(CLIENT_ID)
