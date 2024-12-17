import { ObjectId } from 'mongodb'
import { EPostStatus } from '~/constants/enums'

interface IPost {
  _id?: ObjectId
  user_id: ObjectId
  title: string
  content: string
  author: string
  image: string
  status?: EPostStatus
  created_at?: Date
  updated_at?: Date
}

export default class Post {
  _id?: ObjectId
  user_id: ObjectId
  title: string
  content: string
  author: string
  image: string
  status?: EPostStatus
  created_at: Date
  updated_at: Date
  constructor({ _id, user_id, title, content, author, image, created_at, updated_at, status }: IPost) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.title = title
    this.content = content
    this.author = author
    this.image = image
    this.status = status || EPostStatus.PENDING
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
