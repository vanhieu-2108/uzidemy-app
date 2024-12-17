import { ObjectId } from 'mongodb'
import Progress from '~/model/schemas/Progress.schema'
import databaseService from '~/services/database.services'

class ProgressServices {
  async createProgress(data: any) {
    const { user_id, lecture_id } = data
    const progress = await databaseService.progress.findOne({
      user_id: new ObjectId(user_id),
      lecture_id: new ObjectId(lecture_id)
    })
    if (progress) {
      return {
        message: 'Bài giảng này đã được xem'
      }
    }

    await databaseService.progress.insertOne(new Progress(data))

    return {
      message: 'Đã cập nhật tiến độ học tập'
    }
  }

  async getProgress(course_id: string, user_id: string) {
    const lectures = await databaseService.lectures
      .find({
        course_id: new ObjectId(course_id)
      })
      .toArray()
    const totalLectures = lectures.length

    if (totalLectures === 0) {
      return {
        message: 'Không có bài giảng nào trong khóa học',
        data: { progressPercentage: 0, totalLectures, watchedLectures: 0 }
      }
    }

    const watchedLectures = await databaseService.progress
      .find({
        user_id: new ObjectId(user_id),
        course_id: new ObjectId(course_id)
      })
      .toArray()

    const progressPercentage = (watchedLectures.length / totalLectures) * 100

    return {
      message: 'Lấy tiến độ học tập thành công',
      data: {
        progressPercentage,
        totalLectures,
        watchedLectures
      }
    }
  }
}

const progressServices = new ProgressServices()

export default progressServices
