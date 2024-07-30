import { Request, Response, Router } from 'express'
import { ObjectId } from 'mongodb'
import coursesController from '~/controllers/courses.controllers'
import {
  createCourseValidator,
  deleteCourseValidator,
  getAllCoursesValidator,
  getCourseValidator,
  updateCourseValidator
} from '~/middlewares/courses.middlewares'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import databaseService from '~/services/database.services'
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

coursesRouter.put(
  '/delete/:course_id',
  accessTokenValidator,
  isAdminValidator,
  deleteCourseValidator,
  wrapHandler(coursesController.delete)
)

/**
 * Route lấy danh sách khóa học
 * [GET]: /courses
 * query: {
 * page?: number
 * limit?: number
 * }
 */

coursesRouter.get('', getAllCoursesValidator, wrapHandler(coursesController.getAll))

/**
 * Route lấy thông tin khóa học
 * [GET]: /courses/:course_id
 * params: {
 * course_id: string
 * }
 */

// coursesRouter.get('/test', async (req: Request, res: Response) => {
//   const result = await databaseService.courses
//     .aggregate([
//       {
//         $match: {
//           slug: 'khoa-hoc-js-co-ban2' // Lọc tài liệu dựa trên slug
//         }
//       },
//       {
//         $lookup: {
//           from: 'chapters',
//           localField: '_id',
//           foreignField: 'course_id',
//           as: 'chapter_list' // Kết hợp thông tin từ bảng `chapters` vào mảng `chapter_list`
//         }
//       },
//       {
//         $unwind: {
//           path: '$chapter_list',
//           preserveNullAndEmptyArrays: true // Giữ các tài liệu không có `chapter_list`
//         }
//       },
//       {
//         $lookup: {
//           from: 'lectures',
//           localField: 'chapter_list.lectures', // Trường chứa ID bài giảng trong `chapter_list`
//           foreignField: '_id', // Trường trong bảng `lectures` chứa ID bài giảng
//           as: 'chapter_list.lecture_list' // Tạo mảng mới `lecture_list` trong từng chương
//         }
//       },
//       {
//         $unset: ['chapter_list.lectures', 'chapters']
//       },
//       {
//         $group: {
//           _id: '$_id', // Nhóm theo ID của khóa học
//           slug: { $first: '$slug' },
//           title: { $first: '$title' },
//           description: { $first: '$description' },
//           original_price: { $first: '$original_price' },
//           sale_price: { $first: '$sale_price' },
//           chapters: { $first: '$chapters' },
//           image: { $first: '$image' },
//           view_count: { $first: '$view_count' },
//           benefits: { $first: '$benefits' },
//           requirements: { $first: '$requirements' },
//           faqs: { $first: '$faqs' },
//           created_at: { $first: '$created_at' },
//           updated_at: { $first: '$updated_at' },
//           status: { $first: '$status' },
//           chapter_list: { $push: '$chapter_list' } // Chuyển đổi từ đối tượng thành mảng
//         }
//       }
//     ])
//     .toArray()
//   res.json({
//     message: 'Test',
//     result
//   })
// })

coursesRouter.get('/:slug', getCourseValidator, wrapHandler(coursesController.getCourseBySlug))

export default coursesRouter
