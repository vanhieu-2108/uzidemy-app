export interface CreateReqQuizBody {
  lecture_id: string
  chapter_id: string
  questions: {
    correct_option_id: string
    question: string
    options: {
      correct_answer: string
      option_id: string
    }[]
  }[]
}
