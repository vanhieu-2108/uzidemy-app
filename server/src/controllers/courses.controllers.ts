import { NextFunction, Request, Response } from 'express'
import coursesServices from '~/services/courses.services'
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
  async getCourseBySlug(
    req: Request<{
      slug: string
    }>,
    res: Response,
    next: NextFunction
  ) {
    return res.json({
      message: 'Lấy thông tin khóa học thành công',
      result: req.course
    })
  }
}
const coursesController = new CoursesController()
export default coursesController
