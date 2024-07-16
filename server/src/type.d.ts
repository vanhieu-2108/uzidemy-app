import { JwtPayload } from 'jsonwebtoken'
import User from '~/model/schemas/User.schema'

declare module 'express' {
  interface Request {
    user?: User
    decoded_access_token?: JwtPayload
    decoded_refresh_token?: JwtPayload
  }
}
