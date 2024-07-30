import { ObjectId } from 'mongodb'
import Course, { ECourseStatus } from '~/model/schemas/Course.schema'
import databaseService from '~/services/database.services'

class CourseServices {
  async create(data: any) {
    const result = await databaseService.courses.insertOne(new Course(data))
    return result
  }
  async update(course_id: string, data: any) {
    const result = await databaseService.courses.findOneAndUpdate(
      {
        _id: new ObjectId(course_id)
      },
      {
        $set: data,
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return result
  }
  async delete(course_id: string) {
    const result = await databaseService.courses.updateOne(
      {
        _id: new ObjectId(course_id)
      },
      {
        $set: {
          status: ECourseStatus.DELETED
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return result
  }
  async getAll(query?: { page: number; limit: number }) {
    const page = Number(query?.page) || 1
    const limit = Number(query?.limit) || 10
    const [result, total_page] = await Promise.all([
      await databaseService.courses
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      Math.ceil((await databaseService.courses.countDocuments()) / limit)
    ])
    return {
      data: result,
      pagination: {
        page,
        limit,
        total_page
      }
    }
  }
  async getCourseById(course_id: string) {
    const result = await databaseService.courses.findOne({
      _id: new ObjectId(course_id)
    })
    return result
  }
  async getCourseBySlug(slug: string) {
    await databaseService.courses.updateOne(
      {
        slug: slug
      },
      {
        $inc: {
          view_count: 1
        }
      }
    )
    const result = await databaseService.courses
      .aggregate([
        {
          $match: {
            slug: slug
          }
        },
        {
          $lookup: {
            from: 'chapters',
            localField: '_id',
            foreignField: 'course_id',
            as: 'chapter_list' // Kết hợp thông tin từ bảng `chapters` vào mảng `chapter_list`
          }
        },
        {
          $unwind: {
            path: '$chapter_list',
            preserveNullAndEmptyArrays: true // Giữ các tài liệu không có `chapter_list`
          }
        },
        {
          $lookup: {
            from: 'lectures',
            localField: 'chapter_list.lectures', // Trường chứa ID bài giảng trong `chapter_list`
            foreignField: '_id', // Trường trong bảng `lectures` chứa ID bài giảng
            as: 'chapter_list.lecture_list' // Tạo mảng mới `lecture_list` trong từng chương
          }
        },
        {
          $unset: 'chapter_list.lectures'
        },
        {
          $group: {
            _id: '$_id', // Nhóm theo ID của khóa học
            slug: { $first: '$slug' },
            title: { $first: '$title' },
            description: { $first: '$description' },
            original_price: { $first: '$original_price' },
            sale_price: { $first: '$sale_price' },
            chapters: { $first: '$chapters' },
            image: { $first: '$image' },
            view_count: { $first: '$view_count' },
            benefits: { $first: '$benefits' },
            requirements: { $first: '$requirements' },
            faqs: { $first: '$faqs' },
            created_at: { $first: '$created_at' },
            updated_at: { $first: '$updated_at' },
            status: { $first: '$status' },
            chapter_list: { $push: '$chapter_list' } // Chuyển đổi từ đối tượng thành mảng
          }
        },
        {
          $project: {
            chapters: 0 // Loại bỏ trường `chapters`
          }
        }
      ])
      .toArray()
    return result[0]
  }
}

const coursesServices = new CourseServices()
export default coursesServices
