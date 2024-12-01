import { ObjectId } from 'mongodb'
interface IChapter {
  _id?: ObjectId
  title: string
  course_id: ObjectId
  lectures?: ObjectId[]
  _destroy?: boolean
  created_at?: Date
  updated_at?: Date
}

export default class Chapter {
  _id?: ObjectId
  title: string
  course_id: ObjectId
  lectures: ObjectId[]
  _destroy: boolean
  created_at: Date
  updated_at: Date
  constructor({ _id, title, course_id, lectures, _destroy, created_at, updated_at }: IChapter) {
    const date = new Date()
    this._id = _id
    this.title = title
    this.course_id = course_id
    this.lectures = lectures || []
    this._destroy = _destroy || false
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
