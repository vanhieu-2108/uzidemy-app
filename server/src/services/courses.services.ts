import { ObjectId } from 'mongodb'
import Course, { ECourseStatus } from '~/model/schemas/Course.schema'
import databaseService from '~/services/database.services'

class CourseServices {
  async create(data: any) {
    const result = await databaseService.courses.insertOne(new Course(data))
    return result
  }
  async update(course_id: string, data: any) {
    if (!ObjectId.isValid(course_id)) {
      throw new Error('course_id không hợp lệ')
    }
    const { _id, ...updateData } = data
    const result = await databaseService.courses.findOneAndUpdate(
      {
        _id: new ObjectId(course_id)
      },
      {
        $set: updateData,
        $currentDate: { updated_at: true }
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
      databaseService.courses
        .aggregate([
          { $match: { status: ECourseStatus.ACTIVE } },
          { $sort: { created_at: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: 'chapters',
              localField: '_id',
              foreignField: 'course_id',
              as: 'chapters'
            }
          }
        ])
        .toArray(),
      Math.ceil((await databaseService.courses.countDocuments({ status: ECourseStatus.ACTIVE })) / limit)
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

  async getAllByAdmin(query?: { page: number; limit: number }) {
    const page = Number(query?.page) || 1
    const limit = Number(query?.limit) || 10
    const [result, total_page] = await Promise.all([
      databaseService.courses
        .aggregate([
          { $sort: { created_at: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: 'chapters',
              localField: '_id',
              foreignField: 'course_id',
              as: 'chapters'
            }
          }
        ])
        .toArray(),
      Math.ceil((await databaseService.courses.countDocuments({ status: ECourseStatus.ACTIVE })) / limit)
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

  async getPurchasedCourses(user_id: string) {
    const result = await databaseService.orders
      .aggregate([
        {
          $match: {
            status: 'SUCCESS',
            user_id: new ObjectId(user_id) // Ensure user_id is a valid ObjectId
          }
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'course_id',
            foreignField: '_id',
            as: 'course'
          }
        },
        {
          $unwind: '$course' // Unwind the course array to get a single course
        },
        {
          $lookup: {
            from: 'chapters',
            localField: 'course._id', // Link chapters to course's _id
            foreignField: 'course_id',
            as: 'chapters' // Add the chapters data under the 'chapters' key
          }
        },
        {
          $unwind: {
            path: '$chapters', // Unwind the chapters array
            preserveNullAndEmptyArrays: true // Preserve entries without chapters
          }
        },
        {
          $lookup: {
            from: 'lectures',
            localField: 'chapters._id', // Link lectures to chapter's _id
            foreignField: 'chapter_id', // Assuming lectures has a chapter_id field
            as: 'chapters.lectures' // Embed lectures inside the chapters array
          }
        },
        {
          $group: {
            _id: '$_id',
            user_id: { $first: '$user_id' },
            course: { $first: '$course' },
            chapters: { $push: '$chapters' } // Re-group chapters after unwinding them
          }
        },
        {
          $project: {
            _id: 1,
            user_id: 1,
            course: 1,
            chapters: 1 // Include chapters with nested lectures
          }
        }
      ])
      .toArray()

    return result
  }
}

const coursesServices = new CourseServices()
export default coursesServices
