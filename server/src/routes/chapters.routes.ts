import { Router } from 'express'
import chaptersController from '~/controllers/chapters.controllers'
import {
  createChapterValidator,
  deleteChapterValidator,
  updateChapterValidator
} from '~/middlewares/chapters.middlewares'

import { accessTokenValidator } from '~/middlewares/users.middlewares'
const chaptersRouter = Router()

/**
 * Route tạo mới một chương
 * [POST]: /lectures/create
 * body: {
 * title: string,
 * course_id: string
 * }
 */

chaptersRouter.post('', accessTokenValidator, createChapterValidator, chaptersController.create)

/**
 * Route cập nhật chương
 * body: {
 * title: string
 * }
 */

chaptersRouter.put('/:chapter_id', accessTokenValidator, updateChapterValidator, chaptersController.update)

/**
 * Route xóa chương
 * body: {
 * _destroy: boolean
 * }
 */

chaptersRouter.put('/delete/:chapter_id', accessTokenValidator, deleteChapterValidator, chaptersController.delete)

export default chaptersRouter
