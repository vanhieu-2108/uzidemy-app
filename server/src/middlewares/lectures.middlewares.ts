import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/model/Errors'
import databaseService from '~/services/database.services'
import validate from '~/utils/validation'

export const createLectureValidator = validate(
  checkSchema(
    {
      slug: {
        isString: {
          errorMessage: 'Đường dẫn bài học phải là chuỗi'
        },
        custom: {
          options: async (value) => {
            const findLecture = await databaseService.lectures.findOne({
              slug: value
            })
            if (findLecture) {
              throw new ErrorWithStatus({
                message: 'Đường dẫn bài học đã tồn tại',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      title: {
        isString: {
          errorMessage: 'Tiêu đề bài học phải là chuỗi'
        },
        isLength: {
          options: { min: 1, max: 255 },
          errorMessage: 'Tiêu đề bài học phải có độ dài từ 1 đến 255 ký tự'
        }
      },
      video_url: {
        isString: {
          errorMessage: 'Đường dẫn video bài học phải là chuỗi'
        },
        isLength: {
          options: { min: 1, max: 255 },
          errorMessage: 'Đường dẫn video bài học phải có độ dài từ 1 đến 255 ký tự'
        }
      },
      content: {
        isString: {
          errorMessage: 'Nội dung bài học phải là chuỗi'
        }
      },
      chapter_id: {
        isMongoId: {
          errorMessage: 'ID chương không hợp lệ'
        },
        custom: {
          options: async (value) => {
            const findChapter = await databaseService.chapters.findOne({
              _id: new ObjectId(value)
            })
            if (!findChapter) {
              throw new ErrorWithStatus({
                message: 'Chương không tồn tại',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      course_id: {
        isMongoId: {
          errorMessage: 'ID khóa học không hợp lệ'
        },
        custom: {
          options: async (value) => {
            const findCourse = await databaseService.courses.findOne({
              _id: new ObjectId(value)
            })
            if (!findCourse) {
              throw new ErrorWithStatus({
                message: 'Khóa học không tồn tại',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateLectureValidator = validate(
  checkSchema(
    {
      slug: {
        isString: {
          errorMessage: 'Đường dẫn bài học phải là chuỗi'
        },
        custom: {
          options: async (value) => {
            const findLecture = await databaseService.lectures.findOne({
              slug: value
            })
            if (findLecture) {
              throw new ErrorWithStatus({
                message: 'Đường dẫn bài học đã tồn tại',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      title: {
        isString: {
          errorMessage: 'Tiêu đề bài học phải là chuỗi'
        },
        isLength: {
          options: { min: 1, max: 255 },
          errorMessage: 'Tiêu đề bài học phải có độ dài từ 1 đến 255 ký tự'
        }
      },
      video_url: {
        isString: {
          errorMessage: 'Đường dẫn video bài học phải là chuỗi'
        },
        isLength: {
          options: { min: 1, max: 255 },
          errorMessage: 'Đường dẫn video bài học phải có độ dài từ 1 đến 255 ký tự'
        }
      },
      content: {
        isString: {
          errorMessage: 'Nội dung bài học phải là chuỗi'
        }
      },
      chapter_id: {
        isMongoId: {
          errorMessage: 'ID chương không hợp lệ'
        },
        custom: {
          options: async (value) => {
            const findChapter = await databaseService.chapters.findOne({
              _id: new ObjectId(value)
            })
            if (!findChapter) {
              throw new ErrorWithStatus({
                message: 'Chương không tồn tại',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      course_id: {
        isMongoId: {
          errorMessage: 'ID khóa học không hợp lệ'
        },
        custom: {
          options: async (value) => {
            const findCourse = await databaseService.courses.findOne({
              _id: new ObjectId(value)
            })
            if (!findCourse) {
              throw new ErrorWithStatus({
                message: 'Khóa học không tồn tại',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      lecture_id: {
        isMongoId: {
          errorMessage: 'ID bài học không hợp lệ'
        },
        custom: {
          options: async (value) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: 'ID bài học không được để trống',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const fingLecture = await databaseService.lectures.findOne({
              _id: new ObjectId(value)
            })
            if (!fingLecture) {
              throw new ErrorWithStatus({
                message: 'Bài học không tồn tại',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const deleteLessonValidator = validate(
  checkSchema(
    {
      lecture_id: {
        custom: {
          options: async (value) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: 'ID bài học không được để trống',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: 'ID bài học không hợp lệ',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const fingLecture = await databaseService.lectures.findOne({
              _id: new ObjectId(value)
            })
            if (!fingLecture) {
              throw new ErrorWithStatus({
                message: 'Bài học không tồn tại',
                status: HTTP_STATUS.BAD_REQUEST
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

export const changeStatusValidator = validate(
  checkSchema(
    {
      lecture_id: {
        custom: {
          options: async (value) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: 'ID bài học không được để trống',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: 'ID bài học không hợp lệ',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const fingLecture = await databaseService.lectures.findOne({
              _id: new ObjectId(value)
            })
            if (!fingLecture) {
              throw new ErrorWithStatus({
                message: 'Bài học không tồn tại',
                status: HTTP_STATUS.BAD_REQUEST
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
