import { Response } from 'express'

export interface TypedResponse extends Response {
  statusCode: any
  _getData: () => any
}
