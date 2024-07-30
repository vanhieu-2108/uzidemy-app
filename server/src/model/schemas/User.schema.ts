import { ObjectId } from 'mongodb'
import { ERole } from '~/constants/enums'

export enum EVerifyUser {
  UNVERIFY, // Chưa xác thực
  VERIFIED, // Đã xác thực
  BANNED // Bị khóa
}

export interface IUser {
  _id?: ObjectId
  email: string
  fullname: string
  password: string
  verify?: EVerifyUser
  courses?: ObjectId[]
  role?: ERole
  email_verify_token?: string
  forgot_password_token?: string
  avatar?: string
  created_at?: Date
  updated_at?: Date
}
export default class User {
  _id?: ObjectId
  email: string
  fullname: string
  password: string
  verify?: EVerifyUser
  courses?: ObjectId[]
  role?: ERole
  email_verify_token?: string
  forgot_password_token?: string
  avatar?: string
  created_at?: Date
  updated_at?: Date
  constructor({
    _id,
    email,
    fullname,
    password,
    verify,
    courses,
    role,
    email_verify_token,
    forgot_password_token,
    avatar,
    created_at,
    updated_at
  }: IUser) {
    const date = new Date()
    this._id = _id || new ObjectId()
    this.email = email
    this.fullname = fullname
    this.password = password
    this.verify = verify || EVerifyUser.UNVERIFY
    this.courses = courses || []
    this.role = role || ERole.USER
    this.email_verify_token = email_verify_token || ''
    this.forgot_password_token = forgot_password_token || ''
    this.avatar = avatar || ''
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
