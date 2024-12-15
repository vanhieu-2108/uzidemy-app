import { ObjectId } from 'mongodb'

interface IQuestion {
  question: string
  correct_option_id: string
  options: {
    correct_answer: string
    option_id: string
  }[]
}

interface IQuiz {
  _id?: ObjectId
  lecture_id: ObjectId
  chapter_id: ObjectId
  questions: IQuestion[]
  _destroy?: boolean
  created_at?: Date
  updated_at?: Date
}

export default class Quiz {
  _id?: ObjectId
  lecture_id: ObjectId
  chapter_id: ObjectId
  questions: IQuestion[]
  _destroy: boolean
  created_at: Date
  updated_at: Date
  constructor({ _id, lecture_id, chapter_id, questions, _destroy, created_at, updated_at }: IQuiz) {
    const date = new Date()
    this._id = _id
    this.lecture_id = lecture_id
    this.chapter_id = chapter_id
    this.questions = questions
    this._destroy = _destroy || false
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
