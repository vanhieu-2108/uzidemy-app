import { ObjectId } from 'mongodb'

interface IPost {
  _id?: ObjectId
  user_id: ObjectId
  title: string
  content: string
  author: string
  image: string
  created_at?: Date
  updated_at?: Date
  _destroy?: boolean
}

export default class Post {
  _id?: ObjectId
  user_id: ObjectId
  title: string
  content: string
  author: string
  image: string
  created_at: Date
  updated_at: Date
  _destroy: boolean
  constructor({ _id, user_id, title, content, author, image, created_at, updated_at, _destroy }: IPost) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.title = title
    this.content = content
    this.author = author
    this.image = image
    this.created_at = created_at || date
    this.updated_at = updated_at || date
    this._destroy = _destroy || false
  }
}
