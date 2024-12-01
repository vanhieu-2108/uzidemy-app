import { NextFunction, Request, Response } from 'express'
import { TokenPayload } from '~/model/requests/User.requests'
import commentsService from '~/services/comments.services'

class CommentsController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_access_token as TokenPayload
    const result = await commentsService.create(user_id, req.body)
    res.json(result)
  }
  async update(req: Request, res: Response, next: NextFunction) {
    const { comment_id } = req.params
    const result = await commentsService.update(comment_id, req.body)
    res.json(result)
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    const { comment_id } = req.params
    const result = await commentsService.delete(comment_id)
    res.json(result)
  }
  async getCommentsByObjectId(req: Request, res: Response, next: NextFunction) {
    const { object_id } = req.params
    const result = await commentsService.getCommentsByObjectId(object_id)
    res.json(result)
  }
}

const commentsController = new CommentsController()
export default commentsController
