import { ObjectId } from 'mongodb'
import { ERole } from '~/constants/enums'
import { CreateReqQuizBody } from '~/model/requests/Quiz.requests'
import Quiz from '~/model/schemas/Quiz.schema'
import databaseService from '~/services/database.services'

class QuizzesService {
  async create(body: CreateReqQuizBody) {
    await databaseService.quizzes.insertOne(
      new Quiz({
        ...body,
        lecture_id: new ObjectId(body.lecture_id),
        chapter_id: new ObjectId(body.chapter_id)
      })
    )
    return {
      message: 'Tạo bài kiểm tra thành công'
    }
  }
  async update(quiz_id: string, body: any) {
    const result = await databaseService.quizzes.findOneAndUpdate(
      {
        _id: new ObjectId(quiz_id)
      },
      {
        $set: {
          ...body,
          lecture_id: new ObjectId(body.lecture_id),
          chapter_id: new ObjectId(body.chapter_id)
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
  async getAllQuizByChapterId(chapter_id: string, role: ERole) {
    const matchCondition = {
      chapter_id: new ObjectId(chapter_id),
      ...(role === ERole.ADMIN ? {} : { _destroy: { $ne: true } })
    }
    const quizzes = await databaseService.quizzes
      .aggregate([
        {
          $match: matchCondition
        },
        {
          $lookup: {
            from: 'lectures',
            localField: 'lecture_id',
            foreignField: '_id',
            as: 'lecture'
          }
        },
        {
          $project: {
            lecture_id: 0
          }
        },
        {
          $unwind: '$lecture'
        }
      ])
      .toArray()

    return {
      message: 'Lấy danh sách bài kiểm tra thành công',
      result: quizzes
    }
  }

  async getQuizById(quiz_id: string) {
    const findQuiz = await databaseService.quizzes.findOne({
      _id: new ObjectId(quiz_id)
    })
    if (!findQuiz) {
      throw new Error('Không tìm thấy bài kiểm tra')
    }
    return {
      message: 'Lấy chi tiết bài kiểm tra thành công',
      result: findQuiz
    }
  }
}

const quizzesService = new QuizzesService()
export default quizzesService
