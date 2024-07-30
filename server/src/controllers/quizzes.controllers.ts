import { NextFunction, Request, Response } from 'express'
import quizzesService from '~/services/quizzes.services'

class QuizzesController {
  async create(req: Request, res: Response, next: NextFunction) {
    const result = await quizzesService.create(req.body)
    res.json(result)
  }
  async update(req: Request, res: Response, next: NextFunction) {
    const result = await quizzesService.update(req.params.quiz_id, req.body)
    res.json(result)
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    const result = await quizzesService.delete(req.params.quiz_id)
    res.json(result)
  }
  async getAllQuizByLectureId(req: Request, res: Response, next: NextFunction) {
    const result = await quizzesService.getAllQuizByLectureId(req.params.lecture_id)
    res.json(result)
  }
}

const quizzesController = new QuizzesController()

export default quizzesController
