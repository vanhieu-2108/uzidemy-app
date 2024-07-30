import { ObjectId } from 'mongodb'
import { EObjectTypeComment } from '~/constants/enums'

interface IComment {
  _id?: ObjectId
  user_id: ObjectId
  parent_id: ObjectId | null
  object_id: ObjectId
  object_type: EObjectTypeComment
  content: string
  _destroy?: boolean
  created_at?: Date
  updated_at?: Date
}

export default class Comment {
  _id?: ObjectId
  user_id: ObjectId
  parent_id: ObjectId | null
  object_id: ObjectId
  object_type: EObjectTypeComment
  content: string
  _destroy: boolean
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    user_id,
    parent_id,
    object_id,
    object_type,
    content,
    _destroy,
    created_at,
    updated_at
  }: IComment) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.parent_id = parent_id || null
    this.object_id = object_id
    this.object_type = object_type
    this.content = content
    this._destroy = _destroy || false
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
