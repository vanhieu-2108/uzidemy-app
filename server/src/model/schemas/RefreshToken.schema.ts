import { ObjectId } from 'mongodb'

interface IRefreshToken {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  iat: number
  exp: number
}

export default class RefreshToken {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  iat: Date
  exp: Date
  constructor({ _id, user_id, token, iat, exp }: IRefreshToken) {
    this._id = _id
    this.user_id = user_id
    this.token = token
    this.iat = new Date(iat * 1000)
    this.exp = new Date(exp * 1000)
  }
}
