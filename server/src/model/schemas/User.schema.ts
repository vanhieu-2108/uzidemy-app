import { ObjectId } from 'mongodb'
import { ERole } from '~/constants/enums'

export interface IUser {
  _id?: ObjectId
  email: string
  fullname: string
  password: string
  role?: ERole
  email_verify_token?: string
  forgot_password_token?: string
  _destroy?: boolean
  avatar?: string
  created_at?: Date
  updated_at?: Date
}
export default class User {
  _id?: ObjectId
  email: string
  fullname: string
  password: string
  role?: ERole
  email_verify_token?: string
  avatar?: string
  created_at?: Date
  updated_at?: Date
  _destroy?: boolean
  constructor({
    _id,
    email,
    fullname,
    password,
    role,
    email_verify_token,
    forgot_password_token,
    _destroy,
    avatar,
    created_at,
    updated_at
  }: IUser) {
    const date = new Date()
    this._id = _id || new ObjectId()
    this.email = email
    this.fullname = fullname
    this.password = password
    this.role = role || ERole.USER
    this.email_verify_token = email_verify_token || ''
    this.avatar = avatar || ''
    this.created_at = created_at || date
    this.updated_at = updated_at || date
    this._destroy = _destroy || false
  }
}
