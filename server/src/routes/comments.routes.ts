import { Router } from 'express'
import commentsController from '~/controllers/comments.controllers'
import {
  createCommentValidator,
  deleteCommentValidator,
  getCommentsByObjectIdValidator,
  updateCommentValidator
} from '~/middlewares/comments.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapHandler } from '~/utils/wrapHandler'

const commentsRouter = Router()

/**
 * Route tạo mới một comment
 * [POST] /comments
 * body: {
 *  parent_id?: string | null
 *  object_id: string
 *  object_type: EObjectTypeComment
 *  content: string
 * }
 */

commentsRouter.post('', accessTokenValidator, createCommentValidator, wrapHandler(commentsController.create))

/**
 * Route cập nhật một comment
 * [PUT] /comments/:comment_id
 * body: {
 * parent_id?: string | null
 * object_id: string
 * object_type: EObjectTypeComment
 * content: string
 * }
 */

commentsRouter.put('/:comment_id', accessTokenValidator, updateCommentValidator, wrapHandler(commentsController.update))

/**
 * Route xóa một comment
 * [DELETE] /comments/:comment_id
 */

commentsRouter.delete(
  '/:comment_id',
  accessTokenValidator,
  deleteCommentValidator,
  wrapHandler(commentsController.delete)
)

/**
 * Route lấy danh sách comment theo object_id
 * [GET] /comments/:object_id
 */

commentsRouter.get('/:object_id', getCommentsByObjectIdValidator, wrapHandler(commentsController.getCommentsByObjectId))

export default commentsRouter
