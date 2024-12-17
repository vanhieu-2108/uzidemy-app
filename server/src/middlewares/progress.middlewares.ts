import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/model/Errors'
import databaseService from '~/services/database.services'
import validate from '~/utils/validation'

export const getProgressValidator = validate(
  checkSchema({
    course_id: {
      isMongoId: {
        errorMessage: 'ID khóa học không hợp lệ'
      },
      custom: {
        options: async (value) => {
          const findCourse = await databaseService.courses.findOne({ _id: new ObjectId(value) })
          if (!findCourse) {
            throw new ErrorWithStatus({
              message: 'Khóa học không tồn tại',
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          return true
        }
      }
    }
  })
)

export const createProgressValidator = validate(
  checkSchema({
    course_id: {
      isMongoId: {
        errorMessage: 'ID bài học không hợp lệ'
      },
      custom: {
        options: async (value, { req }) => {
          const findCourse = await databaseService.courses.findOne({ _id: new ObjectId(value) })
          if (!findCourse) {
            throw new ErrorWithStatus({
              message: 'Khóa học không tồn tại',
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          return true
        }
      }
    }
  })
)
