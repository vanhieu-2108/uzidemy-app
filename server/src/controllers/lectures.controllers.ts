import { NextFunction, Request, Response } from 'express'
import lectureService from '~/services/lectures.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateLectureReqBody } from '~/model/requests/Lecture.requests'

class LecturesController {
  async create(req: Request, res: Response, next: NextFunction) {
    const result = await lectureService.create(req.body)
    res.json(result)
  }
  async update(req: Request<ParamsDictionary, any, CreateLectureReqBody>, res: Response, next: NextFunction) {
    const result = await lectureService.update(req.params.lecture_id, req.body)
    res.json(result)
  }
  async delete(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const result = await lectureService.delete(req.params.lecture_id)
    res.json(result)
  }

  async changeStatus(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const result = await lectureService.changeStatus(req.params.lecture_id)
    res.json(result)
  }
}

const lecturesController = new LecturesController()
export default lecturesController
