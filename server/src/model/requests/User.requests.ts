import { JwtPayload } from 'jsonwebtoken'
import { ERole } from '~/constants/enums'

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
