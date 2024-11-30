import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import coursesServices from '~/services/courses.services'
import databaseService from '~/services/database.services'
class CoursesController {
  async create(req: Request, res: Response, next: NextFunction) {
    await coursesServices.create(req.body)
    return res.json({
      message: 'Tạo khóa học thành công'
    })
  }
  async update(
    req: Request<{
      course_id: string
    }>,
    res: Response,
    next: NextFunction
  ) {
    const { course_id } = req.params
    const result = await coursesServices.update(course_id, req.body)
    return res.json({
      message: 'Cập nhật khóa học thành công',
      data: result
    })
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    const { course_id } = req.params
    await coursesServices.delete(course_id)
    return res.json({
      message: 'Xóa khóa học thành công'
    })
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    const result = await coursesServices.getAll(req.query as any)
    return res.json({
      message: 'Lấy danh sách khóa học thành công',
      result
    })
  }

  async getAllByAdmin(req: Request, res: Response, next: NextFunction) {
    const result = await coursesServices.getAllByAdmin(req.query as any)
    return res.json({
      message: 'Lấy danh sách khóa học thành công',
      result
    })
  }

  async getCourseBySlug(
    req: Request<{
      slug: string
    }>,
    res: Response,
    next: NextFunction
  ) {
    const { slug } = req.params
    const result = await coursesServices.getCourseBySlug(slug)
    return res.json({
      message: 'Lấy thông tin khóa học thành công',
      result
    })
  }
  async getCourseContent(req: Request, res: Response, next: NextFunction) {
    const { course_id } = req.params
    // Tìm khóa học trong database
    const course = await databaseService.courses.findOne({
      _id: new ObjectId(course_id)
    })
    // Nếu không tìm thấy khóa học
    if (!course) {
      return res.status(404).json({
        message: 'Không tìm thấy khóa học'
      })
    }
    // Lấy thông tin chapters và lectures liên quan
    const result = await databaseService.chapters
      .aggregate([
        {
          $match: {
            course_id: new ObjectId(course_id)
          }
        },
        {
          $lookup: {
            from: 'lectures',
            localField: '_id',
            foreignField: 'chapter_id',
            as: 'lectures'
          }
        }
      ])
      .toArray()
    return res.json({
      message: 'Lấy thông tin khóa học thành công',
      result
    })
  }
}
const coursesController = new CoursesController()
export default coursesController
