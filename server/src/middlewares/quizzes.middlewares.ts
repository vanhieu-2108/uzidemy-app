import { checkSchema, ParamSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import validate from '~/utils/validation'

const lectureIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Id của bài giảng không được để trống'
  },
  isMongoId: {
    errorMessage: 'Id của bài giảng không hợp lệ'
  },
  custom: {
    options: async (value) => {
      const findLecture = await databaseService.lectures.findOne({
        _id: new ObjectId(value)
      })
      if (!findLecture) {
        return Promise.reject('Id của bài giảng không tồn tại')
      }
      return true
    },
    errorMessage: 'Id của bài giảng không hợp lệ'
  }
}

export const createQuizValidator = validate(
  checkSchema(
    {
      chapter_id: {
        notEmpty: {
          errorMessage: 'Id của chương không được để trống'
        },
        isMongoId: {
          errorMessage: 'Id của chương không hợp lệ'
        },
        custom: {
          options: async (value) => {
            const findChapter = await databaseService.chapters.findOne({
              _id: new ObjectId(value)
            })
            if (!findChapter) {
              return Promise.reject('Chương không tồn tại')
            }
            return true
          }
        }
      },
      lecture_id: {
        ...lectureIdSchema,
        errorMessage: 'lecture_id không hợp lệ'
      },
      questions: {
        isArray: {
          errorMessage: 'Danh sách câu hỏi phải là một mảng'
        },
        custom: {
          options: (value) => Array.isArray(value) && value.length > 0,
          errorMessage: 'Danh sách câu hỏi không hợp lệ'
        },
        customSanitizer: {
          options: (value) => value || []
        }
      },
      'questions.*.question': {
        exists: {
          errorMessage: 'Mỗi câu hỏi phải có trường question'
        },
        isString: {
          errorMessage: 'Câu hỏi phải là một chuỗi'
        },
        notEmpty: {
          errorMessage: 'Câu hỏi không được để trống'
        }
      },
      'questions.*.correct_option_id': {
        notEmpty: {
          errorMessage: 'Id của câu trả lời đúng không được để trống'
        },
        custom: {
          options: (value, { req }) => {
            const questions = req.body.questions || []
            return questions.some((q: any) => q.options.some((option: any) => option.option_id === value))
          },
          errorMessage: 'correct_option_id không khớp với bất kỳ option nào'
        }
      },
      'questions.*.options': {
        isArray: {
          errorMessage: 'Danh sách options phải là một mảng'
        },
        custom: {
          options: (value) => Array.isArray(value) && value.length > 0,
          errorMessage: 'Danh sách options không hợp lệ'
        }
      },
      'questions.*.options.*.correct_answer': {
        exists: {
          errorMessage: 'Mỗi option phải có trường correct_answer'
        },
        isString: {
          errorMessage: 'correct_answer phải là một chuỗi'
        },
        notEmpty: {
          errorMessage: 'correct_answer không được để trống'
        }
      },
      'questions.*.options.*.option_id': {
        isString: {
          errorMessage: 'option_id phải là một chuỗi'
        },
        notEmpty: {
          errorMessage: 'option_id không được để trống'
        }
      }
    },
    ['body']
  )
)

export const updateQuizValidator = validate(
  checkSchema(
    {
      quiz_id: {
        isMongoId: {
          errorMessage: 'Id của bài quiz không hợp lệ'
        },
        notEmpty: {
          errorMessage: 'Id của bài quiz không được để trống'
        },
        custom: {
          options: async (value) => {
            const findQuiz = await databaseService.quizzes.findOne({
              _id: new ObjectId(value)
            })
            if (!findQuiz) {
              return Promise.reject('Bài quiz không tồn tại')
            }
            return true
          }
        }
      },
      chapter_id: {
        notEmpty: {
          errorMessage: 'Id của chương không được để trống'
        },
        isMongoId: {
          errorMessage: 'Id của chương không hợp lệ'
        },
        custom: {
          options: async (value) => {
            const findChapter = await databaseService.chapters.findOne({
              _id: new ObjectId(value)
            })
            if (!findChapter) {
              return Promise.reject('Chương không tồn tại')
            }
            return true
          }
        }
      },
      lecture_id: {
        ...lectureIdSchema,
        errorMessage: 'lecture_id không hợp lệ'
      },
      questions: {
        isArray: {
          errorMessage: 'Danh sách câu hỏi phải là một mảng'
        },
        custom: {
          options: (value) => Array.isArray(value) && value.length > 0,
          errorMessage: 'Danh sách câu hỏi không hợp lệ'
        },
        customSanitizer: {
          options: (value) => value || []
        }
      },
      'questions.*.question': {
        exists: {
          errorMessage: 'Mỗi câu hỏi phải có trường question'
        },
        isString: {
          errorMessage: 'Câu hỏi phải là một chuỗi'
        },
        notEmpty: {
          errorMessage: 'Câu hỏi không được để trống'
        }
      },
      'questions.*.correct_option_id': {
        notEmpty: {
          errorMessage: 'Id của câu trả lời đúng không được để trống'
        },
        custom: {
          options: (value, { req }) => {
            const questions = req.body.questions || []
            return questions.some((q: any) => q.options.some((option: any) => option.option_id === value))
          },
          errorMessage: 'correct_option_id không khớp với bất kỳ option nào'
        }
      },
      'questions.*.options': {
        isArray: {
          errorMessage: 'Danh sách options phải là một mảng'
        },
        custom: {
          options: (value) => Array.isArray(value) && value.length > 0,
          errorMessage: 'Danh sách options không hợp lệ'
        }
      },
      'questions.*.options.*.correct_answer': {
        exists: {
          errorMessage: 'Mỗi option phải có trường correct_answer'
        },
        isString: {
          errorMessage: 'correct_answer phải là một chuỗi'
        },
        notEmpty: {
          errorMessage: 'correct_answer không được để trống'
        }
      },
      'questions.*.options.*.option_id': {
        isString: {
          errorMessage: 'option_id phải là một chuỗi'
        },
        notEmpty: {
          errorMessage: 'option_id không được để trống'
        }
      }
    },
    ['body', 'params']
  )
)

export const deleteQuizValidator = validate(
  checkSchema(
    {
      quiz_id: {
        notEmpty: {
          errorMessage: 'Id của bài quiz không được để trống'
        },
        isMongoId: {
          errorMessage: 'Id của bài quiz không hợp lệ'
        },
        custom: {
          options: async (value) => {
            const findQuiz = await databaseService.quizzes.findOne({
              _id: new ObjectId(value)
            })
            if (!findQuiz) {
              return Promise.reject('Bài quiz không tồn tại')
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const getAllQuizByLectureIdValidator = validate(
  checkSchema(
    {
      lecture_id: lectureIdSchema
    },
    ['params']
  )
)
