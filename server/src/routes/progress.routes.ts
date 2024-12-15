import { Router } from 'express'
import progressControllers from '~/controllers/progress.controllers'
import { createProgressValidator, getProgressValidator } from '~/middlewares/progress.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapHandler } from '~/utils/wrapHandler'

const progressRouter = Router()

progressRouter.post('', accessTokenValidator, createProgressValidator, wrapHandler(progressControllers.createProgress))

progressRouter.get(
  '/:course_id',
  accessTokenValidator,
  getProgressValidator,
  wrapHandler(progressControllers.getProgress)
)

export default progressRouter
