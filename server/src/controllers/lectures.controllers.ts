import { NextFunction, Request, Response } from 'express'
import lessonsService from '~/services/lectures.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateLectureReqBody } from '~/model/requests/Lesson.requests'

class LecturesController {
  async create(req: Request, res: Response, next: NextFunction) {
    const result = await lessonsService.create(req.body)
    res.json(result)
  }
  async update(req: Request<ParamsDictionary, any, CreateLectureReqBody>, res: Response, next: NextFunction) {
    const result = await lessonsService.update(req.params.lecture_id, req.body)
    res.json(result)
  }
  async delete(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const result = await lessonsService.delete(req.params.lecture_id)
    res.json(result)
  }

  async changeStatus(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const result = await lessonsService.changeStatus(req.params.lecture_id)
    res.json(result)
  }
}

const lecturesController = new LecturesController()
export default lecturesController
