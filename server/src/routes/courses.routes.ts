import { Router } from 'express'
import coursesController from '~/controllers/courses.controllers'
import {
  createCourseValidator,
  deleteCourseValidator,
  getAllCoursesValidator,
  getCourseValidator,
  updateCourseValidator
} from '~/middlewares/courses.middlewares'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import { wrapHandler } from '~/utils/wrapHandler'

const coursesRouter = Router()
/**
 * Route tạo khóa học
 * [POST]: /courses
 * body: {
  slug: string
  title: string
  description: string
  original_price: number
  sale_price: number
  image?: string
  view_count?: number
  benefits?: string[]
  requirements?: string[]
  faqs?: ObjectId[]
* }
 */
coursesRouter.post(
  '',
  accessTokenValidator,
  isAdminValidator,
  createCourseValidator,
  wrapHandler(coursesController.create)
)
/**
 * Route cập nhật khóa học
 * [PUT]: /courses/:course_id
 * params: {
 *  course_id: string
 * }
 * body: {
 * slug: string
 * title: string
 * description: string
 * original_price: number
 * sale_price: number
 * image?: string
 * view_count?: number
 * benefits?: string[]
 * requirements?: string[]
 * faqs?: ObjectId[]
 * }
 */
coursesRouter.put(
  '/:course_id',
  accessTokenValidator,
  isAdminValidator,
  updateCourseValidator,
  wrapHandler(coursesController.update)
)

/**
 * Route Xóa khóa học
 * [PUT]: /courses/:course_id
 * body: {
 * status:'DELETED'
 * }
 */

coursesRouter.delete(
  '/:course_id',
  accessTokenValidator,
  isAdminValidator,
  deleteCourseValidator,
  wrapHandler(coursesController.delete)
)

/**
 * Route lấy danh sách khóa học cho user
 * [GET]: /courses
 * query: {
 * page?: number
 * limit?: number
 * }
 */

coursesRouter.get('', getAllCoursesValidator, wrapHandler(coursesController.getAll))

/**
 * Route lấy thông tin khóa học cho admin
 */

coursesRouter.get(
  '/admin',
  accessTokenValidator,
  isAdminValidator,
  getAllCoursesValidator,
  wrapHandler(coursesController.getAllByAdmin)
)

/**
 * Route lấy thông tin khóa học
 * [GET]: /courses/:course_id
 * params: {
 * course_id: string
 * }
 */

coursesRouter.get('/:slug', getCourseValidator, wrapHandler(coursesController.getCourseBySlug))

/**
 * Route lấy nôi dung khóa học
 * [GET]: /courses/:course_id/content
 * params: {
 * course_id: string
 * }
 */

coursesRouter.get('/:course_id/content', wrapHandler(coursesController.getCourseContent))

export default coursesRouter
