import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateChapterReqBody } from '~/model/requests/Chapter.requests'
import lecturesService from '~/services/chapters.services'

class ChaptersController {
  async create(req: Request<ParamsDictionary, any, CreateChapterReqBody>, res: Response, next: NextFunction) {
    const result = await lecturesService.create(req.body)
    res.json(result)
  }
  async update(
    req: Request<
      {
        chapter_id: string
      },
      any,
      CreateChapterReqBody
    >,
    res: Response,
    next: NextFunction
  ) {
    const result = await lecturesService.update(req.params.chapter_id, req.body)
    res.json(result)
  }
  async delete(
    req: Request<
      {
        chapter_id: string
      },
      any,
      {
        _destroy: boolean
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const result = await lecturesService.delete(req.params.chapter_id)
    res.json(result)
  }
}

const chaptersController = new ChaptersController()
export default chaptersController
