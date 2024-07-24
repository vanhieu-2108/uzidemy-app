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
}

const coursesServices = new CourseServices()
export default coursesServices
