import { ObjectId } from 'mongodb'

export enum EStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  CANCELLED = 'CANCELLED'
}

interface IOrder {
  _id?: ObjectId
  order_id: number
  user_id: ObjectId
  course_id: ObjectId
  price?: number
  status?: EStatus
  created_at?: Date
  updated_at?: Date
  _destroy?: boolean
}

export default class Order {
  _id?: ObjectId
  order_id: number
  user_id: ObjectId
  course_id: ObjectId
  price: number
  status: EStatus
  created_at: Date
  updated_at: Date
  _destroy: boolean
  constructor({ _id, order_id, user_id, course_id, price, status, created_at, updated_at, _destroy }: IOrder) {
    const date = new Date()
    this._id = _id
    this.order_id = order_id
    this.user_id = user_id
    this.course_id = course_id
    this.price = price || 0
    this.status = status || EStatus.PENDING
    this.created_at = created_at || date
    this.updated_at = updated_at || date
    this._destroy = _destroy || false
  }
}
