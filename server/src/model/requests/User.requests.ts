import { JwtPayload } from 'jsonwebtoken'
import { ERole } from '~/constants/enums'
import { EStatusUser } from '~/model/schemas/User.schema'

export interface RegisterReqBody {
  email: string
  fullname: string
  password: string
  confirm_password: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface UpdateMeReqBody {
  fullname: string
  avatar?: string
  email: string
  status: EStatusUser
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: string
  role: ERole
  exp: number
  iat: number
}

export interface ChangePasswordReqBody {
  old_password: string
  new_password: string
  confirm_new_password: string
}
