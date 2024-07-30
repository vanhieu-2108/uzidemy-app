import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/model/Errors'
import databaseService from '~/services/database.services'
import validate from '~/utils/validation'

export const createChapterValidator = validate(
  checkSchema({
    title: {
      isString: {
        errorMessage: 'Chương phải là chuỗi'
      },
      isLength: {
        options: {
          min: 3,
          max: 150
        },
        errorMessage: 'Chương phải có độ dài từ 3 đến 150 ký tự'
      }
    },
    course_id: {
      notEmpty: {
        errorMessage: 'Không được để trống id khóa học'
      },
      isMongoId: {
        errorMessage: 'Id khóa học không hợp lệ'
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

export const updateChapterValidator = validate(
  checkSchema(
    {
      chapter_id: {
        isMongoId: {
          errorMessage: 'Id chương không hợp lệ'
        },
        custom: {
          options: async (value) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: 'Id chương là bắt buộc',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const findChapter = await databaseService.chapters.findOne({
              _id: new ObjectId(value)
            })
            if (!findChapter) {
              throw new ErrorWithStatus({
                message: 'Không tìm thấy chương',
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      },
      title: {
        isString: {
          errorMessage: 'Chương phải là chuỗi'
        },
        isLength: {
          options: {
            min: 3,
            max: 150
          },
          errorMessage: 'Chương phải có độ dài từ 3 đến 150 ký tự'
        }
      }
    },
    ['body', 'params']
  )
)

export const deleteChapterValidator = validate(
  checkSchema(
    {
      chapter_id: {
        isMongoId: {
          errorMessage: 'Id chương không hợp lệ'
        },
        custom: {
          options: async (value) => {
            const findChapter = await databaseService.chapters.findOne({
              _id: new ObjectId(value)
            })
            if (!findChapter) {
              throw new ErrorWithStatus({
                message: 'Không tìm thấy chương',
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
