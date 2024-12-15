import { ObjectId } from 'mongodb'

interface IProgress {
  _id?: ObjectId
  user_id: ObjectId
  lecture_id: ObjectId
  course_id: ObjectId
  is_watched?: boolean
  created_at?: Date
}

export default class Progress {
  _id: ObjectId
  user_id: ObjectId
  lecture_id: ObjectId
  is_watched: boolean
  created_at?: Date
  course_id: ObjectId
  constructor({ _id, user_id, lecture_id, is_watched, created_at, course_id }: IProgress) {
    this._id = _id || new ObjectId()
    this.user_id = new ObjectId(user_id)
    this.lecture_id = new ObjectId(lecture_id)
    this.course_id = new ObjectId(course_id)
    this.is_watched = is_watched || true
    this.created_at = created_at || new Date()
  }
}
