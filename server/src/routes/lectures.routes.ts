import { Router } from 'express'
import lecturesController from '~/controllers/lectures.controllers'
import {
  changeStatusValidator,
  createLectureValidator,
  deleteLessonValidator,
  updateLectureValidator
} from '~/middlewares/lectures.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

const lecturesRouter = Router()

/**
 * Route tạo mới một bài học
 * [POST]: /lectures
 * body: {
 * slug: string,
 * title: string,
 * video_url: string,
 * content: string,
 * course_id: string,
 * lecture_id: string,
 * }
 */

lecturesRouter.post('', accessTokenValidator, createLectureValidator, lecturesController.create)

/**
 * Route cập nhật thông tin một bài học
 * [PUT]: /lectures/:lecture_id
 * body: {
 * slug: string,
 * title: string,
 * video_url: string,
 * content: string,
 * chapter_id: string,
 * course_id: string,
 */

lecturesRouter.put('/:lecture_id', accessTokenValidator, updateLectureValidator, lecturesController.update)

/**
 * Route xóa một bài học
 * [PUT]: /lectures/:lecture_id
 */

lecturesRouter.put('/delete/:lecture_id', accessTokenValidator, deleteLessonValidator, lecturesController.delete)

/**
 * Route thay đổi status của một bài học
 * [PUT]: /lectures/status/:lecture_id
 */

lecturesRouter.put('/status/:lecture_id', accessTokenValidator, changeStatusValidator, lecturesController.changeStatus)

export default lecturesRouter