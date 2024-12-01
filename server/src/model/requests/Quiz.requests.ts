export interface CreateReqQuizBody {
  lecture_id: string
  questions: {
    question: string
    options: {
      correct_answer: string
      option_id: string
    }[]
  }[]
  correct_option_id: string
}
