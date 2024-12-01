import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/model/Errors'
import databaseService from '~/services/database.services'
import validate from '~/utils/validation'

export const createPaymentLinkValidator = validate(
  checkSchema({
    amount: {
      optional: true,
      notEmpty: {
        errorMessage: 'Amount là bắt buộc'
      },
      isNumeric: {
        errorMessage: 'Amount phải là số'
      }
    },
    description: {
      optional: true,
      notEmpty: {
        errorMessage: 'Mô tả là bắt buộc'
      }
    },
    course_id: {
      optional: true,
      notEmpty: {
        errorMessage: 'Course id là bắt buộc'
      },
      isMongoId: {
        errorMessage: 'Course id không hợp lệ'
      },
      custom: {
        options: async (value) => {
          const findCourse = await databaseService.courses.findOne({
            _id: new ObjectId(value)
          })
          if (!findCourse) {
            throw new ErrorWithStatus({
              message: 'Không tìm thấy khóa học',
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          return true
        }
      }
    }
  })
)
