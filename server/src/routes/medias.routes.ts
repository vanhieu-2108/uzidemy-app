import { Router } from 'express'
import mediasController from '~/controllers/medias.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapHandler } from '~/utils/wrapHandler'

const mediasRouter = Router()

/**
 * Route upload hình ảnh
 * [POST]: /medias/upload-image
 * body:{
 * image: File (gửi lên bằng form-data)
 * }
 */

mediasRouter.post('/upload-image', accessTokenValidator, wrapHandler(mediasController.uploadImage))

/**
 * Route upload video
 * [POST]: /medias/upload-video
 * body: {
 * video: File (gửi lên bằng form-data)
 * }
 */

mediasRouter.post('/upload-video', accessTokenValidator, wrapHandler(mediasController.uploadVideo))

export default mediasRouter
