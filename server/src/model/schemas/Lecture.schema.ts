import { ObjectId } from 'mongodb'

interface ILecture {
  _id?: ObjectId
  slug: string
  title: string
  video_url: string
  content: string
  chapter_id: ObjectId
  course_id: ObjectId
  next_lecture_id?: ObjectId | null
  prev_lecture_id?: ObjectId | null
  isWatched?: boolean
  _destroy?: boolean
  created_at?: Date
  updated_at?: Date
}

export default class Lecture {
  _id?: ObjectId
  slug: string
  title: string
  video_url: string
  content: string
  chapter_id: ObjectId
  course_id: ObjectId
  next_lecture_id: ObjectId | null
  prev_lecture_id: ObjectId | null
  isWatched?: boolean
  _destroy: boolean
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    slug,
    title,
    video_url,
    content,
    chapter_id,
    course_id,
    next_lecture_id,
    prev_lecture_id,
    _destroy,
    isWatched,
    created_at,
    updated_at
  }: ILecture) {
    const date = new Date()
    this._id = _id
    this.slug = slug
    this.title = title
    this.video_url = video_url
    this.content = content
    this.chapter_id = chapter_id
    this.course_id = course_id
    this.next_lecture_id = next_lecture_id || null
    this.prev_lecture_id = prev_lecture_id || null
    this.isWatched = isWatched || false
    this._destroy = _destroy || false
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
