import { ObjectId } from 'mongodb'

interface IProgress {
  _id?: ObjectId
  user_id: ObjectId
  lecture_id: ObjectId
  is_watched?: boolean
  created_at?: Date
}

export default class Progress {
  _id: ObjectId
  user_id: ObjectId
  lecture_id: ObjectId
  is_watched: boolean
  created_at?: Date
  constructor({ _id, user_id, lecture_id, is_watched, created_at }: IProgress) {
    this._id = _id || new ObjectId()
    this.user_id = user_id
    this.lecture_id = lecture_id
    this.is_watched = is_watched || false
    this.created_at = created_at || new Date()
  }
}
