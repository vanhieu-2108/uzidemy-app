import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/model/Errors'
import databaseService from '~/services/database.services'
import validate from '~/utils/validation'

export const createCourseValidator = validate(
  checkSchema(
    {
      slug: {
        isString: {
          errorMessage: 'Đường dẫn phải là chuỗi'
        },
        custom: {
          options: async (value) => {
            const findCourse = await databaseService.courses.findOne({
              slug: value
            })
            if (findCourse) {
              throw new ErrorWithStatus({
                message: 'Slug đã tồn tại',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      title: {
        isString: {
          errorMessage: 'Tiêu đề phải là chuỗi'
        },
        isLength: {
          options: { min: 3, max: 255 },
          errorMessage: 'Tiêu đề phải từ 3 đến 255 ký tự'
        }
      },
      description: {
        isString: {
          errorMessage: 'Mô tả phải là chuỗi'
        },
        isLength: {
          options: { min: 3 },
          errorMessage: 'Mô tả phải từ 3 ký tự trở lên'
        }
      },
      original_price: {
        isNumeric: {
          errorMessage: 'Giá gốc phải là số'
        },
        custom: {
          options: (value, { req }) => {
            if (value < req.body.sale_price) {
              throw new Error('Giá gốc phải lớn hơn giá bán')
            }
            return true
          }
        }
      },
      sale_price: {
        isNumeric: {
          errorMessage: 'Giá bán phải là số'
        }
      },
      image: {
        optional: true,
        isString: {
          errorMessage: 'Ảnh phải là chuỗi'
        },
        trim: true,
        isLength: {
          options: {
            min: 0,
            max: 400
          },
          errorMessage: 'Đường dẫn ảnh phải từ 0 đến 400 ký tự'
        },
        custom: {
          options: (value) => {
            if (value) {
              const regex = /(http(s)?:\/\/[a-zA-Z0-9.-]+(:\d+)?(\/[a-zA-Z0-9._-]+)*)\.(jpg|gif|png)/
              if (!regex.test(value)) throw new Error('Đường dẫn ảnh không hợp lệ')
            }
            return true
          }
        }
      },
      view_count: {
        optional: true,
        isNumeric: {
          errorMessage: 'Số lượt xem phải là số'
        },
        isLength: {
          options: { min: 0 },
          errorMessage: 'Số lượt xem phải lớn hơn hoặc bằng 0'
        }
      },
      benefits: {
        optional: true,
        isArray: {
          errorMessage: 'Lợi ích phải là mảng'
        },
        custom: {
          options: (value) => {
            if (value) {
              const isValid = value.every((item: string) => typeof item === 'string')
              if (!isValid) throw new Error('Lợi ích không hợp lệ')
            }
            return true
          }
        }
      },
      requirements: {
        optional: true,
        isArray: {
          errorMessage: 'Yêu cầu phải là mảng'
        },
        custom: {
          options: (value) => {
            if (value) {
              const isValid = value.every((item: string) => typeof item === 'string')
              if (!isValid) throw new Error('Yêu cầu không hợp lệ')
            }
            return true
          }
        }
      },
      faqs: {
        optional: true,
        isArray: {
          errorMessage: 'FAQs phải là mảng'
        }
      },
      'faqs.*.question': {
        optional: true,
        isString: {
          errorMessage: 'Câu hỏi phải là chuỗi'
        }
      },
      'faqs.*.answer': {
        optional: true,
        isString: {
          errorMessage: 'Câu trả lời phải là chuỗi'
        }
      }
    },
    ['body']
  )
)

export const updateCourseValidator = validate(
  checkSchema(
    {
      slug: {
        isString: {
          errorMessage: 'Đường dẫn phải là chuỗi'
        }
      },
      title: {
        isString: {
          errorMessage: 'Tiêu đề phải là chuỗi'
        },
        isLength: {
          options: { min: 3, max: 255 },
          errorMessage: 'Tiêu đề phải từ 3 đến 255 ký tự'
        }
      },
      description: {
        isString: {
          errorMessage: 'Mô tả phải là chuỗi'
        },
        isLength: {
          options: { min: 3 },
          errorMessage: 'Mô tả phải từ 3 ký tự trở lên'
        }
      },
      original_price: {
        isNumeric: {
          errorMessage: 'Giá gốc phải là số'
        },
        custom: {
          options: (value, { req }) => {
            if (value < req.body.sale_price) {
              throw new Error('Giá gốc phải lớn hơn giá bán')
            }
            return true
          }
        }
      },
      sale_price: {
        isNumeric: {
          errorMessage: 'Giá bán phải là số'
        }
      },
      image: {
        optional: true,
        isString: {
          errorMessage: 'Ảnh phải là chuỗi'
        },
        trim: true,
        isLength: {
          options: {
            min: 0,
            max: 400
          },
          errorMessage: 'Đường dẫn ảnh phải từ 0 đến 400 ký tự'
        }
      },
      view_count: {
        optional: true,
        isNumeric: {
          errorMessage: 'Số lượt xem phải là số'
        },
        isLength: {
          options: { min: 0 },
          errorMessage: 'Số lượt xem phải lớn hơn hoặc bằng 0'
        }
      },
      benefits: {
        optional: true,
        isArray: {
          errorMessage: 'Lợi ích phải là mảng'
        },
        custom: {
          options: (value) => {
            if (value && Array.isArray(value)) {
              const isValid = value.every((item: string) => typeof item === 'string')
              if (!isValid) throw new Error('Lợi ích không hợp lệ')
            }
            return true
          }
        }
      },
      requirements: {
        optional: true,
        isArray: {
          errorMessage: 'Yêu cầu phải là mảng'
        },
        custom: {
          options: (value) => {
            if (value && Array.isArray(value)) {
              const isValid = value.every((item: string) => typeof item === 'string')
              if (!isValid) throw new Error('Yêu cầu không hợp lệ')
            }
            return true
          }
        }
      },
      faqs: {
        optional: true,
        isArray: {
          errorMessage: 'FAQs phải là mảng'
        },
        custom: {
          options: (value) => {
            if (value && Array.isArray(value)) {
              // Kiểm tra các câu hỏi và câu trả lời trong mảng
              value.forEach((faq: any) => {
                if (typeof faq.question !== 'string') {
                  throw new Error('Câu hỏi phải là chuỗi')
                }
                if (typeof faq.answer !== 'string') {
                  throw new Error('Câu trả lời phải là chuỗi')
                }
              })
            }
            return true
          }
        }
      },
      'faqs.*.question': {
        optional: false,
        isString: {
          errorMessage: 'Câu hỏi phải là chuỗi'
        }
      },
      'faqs.*.answer': {
        optional: false,
        isString: {
          errorMessage: 'Câu trả lời phải là chuỗi'
        }
      },
      course_id: {
        isMongoId: {
          errorMessage: 'course_id phải là ObjectId'
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
    },
    ['body', 'params']
  )
)
export const deleteCourseValidator = validate(
  checkSchema(
    {
      course_id: {
        isMongoId: {
          errorMessage: 'course_id phải là ObjectId'
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
    },
    ['params']
  )
)

export const getAllCoursesValidator = validate(
  checkSchema(
    {
      page: {
        optional: true,
        custom: {
          options: (value) => {
            if (isNaN(value)) {
              throw new ErrorWithStatus({
                message: 'Trang phải là số',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            if (value < 1) {
              throw new ErrorWithStatus({
                message: 'Trang phải lớn hơn hoặc bằng 1',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      limit: {
        optional: true,
        custom: {
          options: (value) => {
            if (isNaN(value)) {
              throw new ErrorWithStatus({
                message: 'Giới hạn phải là số',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            if (value < 1) {
              throw new ErrorWithStatus({
                message: 'Giới hạn phải lớn hơn hoặc bằng 1',
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)

export const getCourseValidator = validate(
  checkSchema(
    {
      slug: {
        trim: true,
        isString: {
          errorMessage: 'slug phải là string'
        },
        custom: {
          options: async (value, { req }) => {
            const findCourse = await databaseService.courses.findOne({
              slug: value
            })
            if (!findCourse) {
              throw new ErrorWithStatus({
                message: 'Không tìm thấy khóa học',
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            req.course = findCourse
            return true
          }
        }
      }
    },
    ['params']
  )
)
