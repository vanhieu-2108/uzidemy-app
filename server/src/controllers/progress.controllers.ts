import { NextFunction, Request, Response } from 'express'
import { TokenPayload } from '~/model/requests/User.requests'
import progressServices from '~/services/progress.services'

class ProgressControllers {
  async createProgress(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_access_token as TokenPayload
    const result = await progressServices.createProgress({
      user_id,
      ...req.body
    })
    return res.json(result)
  }

  async getProgress(req: Request, res: Response, next: NextFunction) {
    const { course_id } = req.params
    const { user_id } = req.decoded_access_token as TokenPayload
    const result = await progressServices.getProgress(course_id, user_id)
    return res.json(result)
  }
}

const progressControllers = new ProgressControllers()

export default progressControllers
