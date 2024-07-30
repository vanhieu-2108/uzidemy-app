export interface CreateReqQuizBody {
  lecture_id: string
  questions: {
    question: string
    options: {
      correct_answer: string
      is_correct: boolean
    }[]
  }[]
}
