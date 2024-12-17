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

  async getAllQuizByLectureId(lecture_id: string) {
    const findLecture = await databaseService.lectures.findOne({
      _id: new ObjectId(lecture_id)
    })
    if (!findLecture) {
      throw new Error('Không tìm thấy bài học')
    }

    const quizzes = await databaseService.quizzes
      .find({
        lecture_id: new ObjectId(lecture_id)
      })
      .toArray()
    const transformedQuizzes = quizzes.map((quiz) => {
      return {
        ...quiz,
        questions: quiz.questions.map((question) => {
          const { correct_option_id, ...restQuestion } = question
          return restQuestion
        })
      }
    })

    return {
      message: 'Lấy danh sách bài quiz thành công',
      result: transformedQuizzes
    }
  }

  async checkAnswerForQuiz(body: any) {
    const { quiz_id, question_index, selected_option_id } = body

    // Kiểm tra đầu vào
    if (!quiz_id || question_index === undefined || !selected_option_id) {
      throw new Error('Thiếu dữ liệu đầu vào')
    }

    // Truy vấn bài quiz từ cơ sở dữ liệu
    const quiz = await databaseService.quizzes.findOne({
      _id: new ObjectId(quiz_id)
    })

    if (!quiz) {
      throw new Error('Không tìm thấy bài quiz')
    }

    // Lấy câu hỏi theo chỉ số (question_index)
    const question = quiz.questions[question_index]

    if (!question) {
      throw new Error('Không tìm thấy câu hỏi')
    }

    // Tìm đáp án đúng trong mảng options
    const correctOption = question.options.find((option: any) => option.correct_answer)

    if (!correctOption) {
      throw new Error('Không tìm thấy đáp án đúng')
    }

    // Kiểm tra câu trả lời của người dùng
    const isCorrect = correctOption.option_id === selected_option_id

    return {
      message: isCorrect ? 'Câu trả lời đúng' : 'Câu trả lời sai',
      result: {
        isCorrect
      }
    }
  }
}

const quizzesService = new QuizzesService()
export default quizzesService
