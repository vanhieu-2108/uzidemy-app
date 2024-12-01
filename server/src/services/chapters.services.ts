import { ObjectId } from 'mongodb'
import { CreateChapterReqBody } from '~/model/requests/Chapter.requests'
import Chapter from '~/model/schemas/Chapter.schema'
import databaseService from '~/services/database.services'

class LecturesService {
  async create(data: CreateChapterReqBody) {
    const mongoId = new ObjectId()
    await Promise.all([
      databaseService.chapters.insertOne(
        new Chapter({
          title: data.title,
          course_id: new ObjectId(data.course_id),
          _id: mongoId
        })
      ),
      databaseService.courses.updateOne(
        {
          _id: new ObjectId(data.course_id)
        },
        {
          $push: {
            chapters: mongoId
          }
        }
      )
    ])
    return {
      message: 'Tạo chương mới thành công'
    }
  }
  async update(lecture_id: string, data: CreateChapterReqBody) {
    const result = await databaseService.chapters.findOneAndUpdate(
      {
        _id: new ObjectId(lecture_id)
      },
      {
        $set: {
          title: data.title
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      message: 'Cập nhật chương thành công',
      result
    }
  }
  async delete(lecture_id: string) {
    await databaseService.chapters.updateOne(
      {
        _id: new ObjectId(lecture_id)
      },
      {
        $set: {
          _destroy: true
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: 'Xóa chương thành công'
    }
  }
}

const lecturesService = new LecturesService()
export default lecturesService
