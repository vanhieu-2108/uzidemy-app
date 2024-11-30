import { ObjectId } from 'mongodb'
import { CreateReqQuizBody } from '~/model/requests/Quiz.requests'
import Quiz from '~/model/schemas/Quiz.schema'
import databaseService from '~/services/database.services'

class QuizzesService {
  async create(body: CreateReqQuizBody) {
    await databaseService.quizzes.insertOne(
      new Quiz({
        ...body,
        lecture_id: new ObjectId(body.lecture_id)
      })
    )
    return {
      message: 'Tạo bài kiểm tra thành công'
    }
  }
  async update(quiz_id: string, body: CreateReqQuizBody) {
    const result = await databaseService.quizzes.findOneAndUpdate(
      {
        _id: new ObjectId(quiz_id)
      },
      {
        $set: {
          ...body,
          lecture_id: new ObjectId(body.lecture_id)
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
      message: 'Cập nhật bài kiểm tra thành công',
      result
    }
  }
  async delete(quiz_id: string) {
    await databaseService.quizzes.updateOne(
      {
        _id: new ObjectId(quiz_id)
      },
      {
        $set: {
          _destroy: true
        }
      }
    )
    return {
      message: 'Xóa bài kiểm tra thành công'
    }
  }
  async getAllQuizByLectureId(lecture_id: string) {
    const quizzes = await databaseService.quizzes
      .find({
        lecture_id: new ObjectId(lecture_id)
      })
      .toArray()
    return {
      message: 'Lấy danh sách bài kiểm tra thành công',
      result: quizzes
    }
  }
}

const quizzesService = new QuizzesService()
export default quizzesService
