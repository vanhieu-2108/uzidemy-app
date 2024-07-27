import { Router } from 'express'
import staticController from '~/controllers/static.controllers'

const staticRouter = Router()
/**
 * Route serve image
 * [GET]: /images/:name
 */
staticRouter.get('/images/:name', staticController.servImage)
/**
 * Route serve video
 * [GET]: /stream-video/:name
 */
staticRouter.get('/stream-video/:name', staticController.servVideo)
export default staticRouter
