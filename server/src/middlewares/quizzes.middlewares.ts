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
  checkSchema({
    lecture_id: lectureIdSchema,
    questions: {
      isArray: true,
      custom: {
        options: (value) => {
          // Kiểm tra nếu `questions` là mảng và không rỗng
          if (!Array.isArray(value) || value.length === 0) {
            return false
          }
          return true
        },
        errorMessage: 'Danh sách câu hỏi không hợp lệ'
      },
      customSanitizer: {
        options: (value) => value || [] // Đảm bảo rằng giá trị không phải là undefined
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
    'questions.*.options': {
      isArray: {
        errorMessage: 'Mỗi câu hỏi phải có một mảng options'
      },
      custom: {
        options: (value) => {
          // Kiểm tra nếu các phần tử của `options` đều là object
          if (!value.every((option: any) => typeof option === 'object')) {
            return false
          }
          return true
        },
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
      }
    },
    correct_option_id: {
      notEmpty: {
        errorMessage: 'Id của câu trả lời đúng không được để trống'
      },
      custom: {
        options: (value, { req }) => {
          const { questions } = req.body
          if (!questions.some((question: any) => question.options.some((option: any) => option.option_id === value))) {
            return false
          }
          return true
        }
      }
    }
  })
)

export const updateQuizValidator = validate(
  checkSchema({
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
    },
    lecture_id: lectureIdSchema,
    questions: {
      isArray: true,
      custom: {
        options: (value) => {
          // Kiểm tra nếu `questions` là mảng và không rỗng
          if (!Array.isArray(value) || value.length === 0) {
            return false
          }
          return true
        },
        errorMessage: 'Danh sách câu hỏi không hợp lệ'
      },
      customSanitizer: {
        options: (value) => value || [] // Đảm bảo rằng giá trị không phải là undefined
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
    'questions.*.options': {
      isArray: {
        errorMessage: 'Mỗi câu hỏi phải có một mảng options'
      },
      custom: {
        options: (value) => {
          // Kiểm tra nếu các phần tử của `options` đều là object
          if (!value.every((option: any) => typeof option === 'object')) {
            return false
          }
          return true
        },
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
      }
    },
    correct_option_id: {
      notEmpty: {
        errorMessage: 'Id của câu trả lời đúng không được để trống'
      },
      custom: {
        options: (value, { req }) => {
          const { questions } = req.body
          if (!questions.some((question: any) => question.options.some((option: any) => option.option_id === value))) {
            return false
          }
          return true
        }
      }
    }
  })
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
