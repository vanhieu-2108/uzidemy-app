import { JwtPayload } from 'jsonwebtoken'
import Course from '~/model/schemas/Course.schema'
import Post from '~/model/schemas/Post.schema'
import User from '~/model/schemas/User.schema'

declare module 'express' {
  interface Request {
    user?: User
    course?: Course
    post?: Post
    decoded_access_token?: JwtPayload
    decoded_refresh_token?: JwtPayload
    decoded_email_verify_token?: JwtPayload
    decoded_forgot_password_token?: JwtPayload
  }
}
