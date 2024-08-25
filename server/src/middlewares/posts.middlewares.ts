import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/model/Errors'
import databaseService from '~/services/database.services'
import validate from '~/utils/validation'

export const addPostValidator = validate(
  checkSchema(
    {
      title: {
        notEmpty: {
          errorMessage: 'Tiêu đề không được để trống'
        }
      },
      content: {
        notEmpty: {
          errorMessage: 'Nội dung không được để trống'
        }
      },
      author: {
        notEmpty: {
          errorMessage: 'Tác giả không được để trống'
        }
      },
      image: {
        notEmpty: {
          errorMessage: 'Ảnh không được để trống'
        }
      }
    },
    ['body']
  )
)

export const updatePostValidator = validate(
  checkSchema(
    {
      post_id: {
        notEmpty: {
          errorMessage: 'ID bài viết không được để trống'
        },
        isMongoId: {
          errorMessage: 'ID bài viết không hợp lệ'
        },
        custom: {
          options: async (value, { req }) => {
            const findPost = await databaseService.posts.findOne({ _id: new ObjectId(value) })
            if (!findPost) {
              throw new ErrorWithStatus({
                message: 'Bài viết không tồn tại',
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            req.post = findPost
            return true
          }
        }
      },
      title: {
        notEmpty: {
          errorMessage: 'Tiêu đề không được để trống'
        }
      },
      content: {
        notEmpty: {
          errorMessage: 'Nội dung không được để trống'
        }
      },
      author: {
        notEmpty: {
          errorMessage: 'Tác giả không được để trống'
        }
      },
      image: {
        notEmpty: {
          errorMessage: 'Ảnh không được để trống'
        }
      }
    },
    ['body', 'params']
  )
)

export const deletePostValidator = validate(
  checkSchema(
    {
      post_id: {
        notEmpty: {
          errorMessage: 'ID bài viết không được để trống'
        },
        isMongoId: {
          errorMessage: 'ID bài viết không hợp lệ'
        },
        custom: {
          options: async (value, { req }) => {
            const findPost = await databaseService.posts.findOne({ _id: new ObjectId(value) })
            if (!findPost) {
              throw new ErrorWithStatus({
                message: 'Bài viết không tồn tại',
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            req.post = findPost
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const getPostValidator = validate(
  checkSchema(
    {
      post_id: {
        notEmpty: {
          errorMessage: 'ID bài viết không được để trống'
        },
        isMongoId: {
          errorMessage: 'ID bài viết không hợp lệ'
        },
        custom: {
          options: async (value, { req }) => {
            const findPost = await databaseService.posts.findOne({ _id: new ObjectId(value) })
            if (!findPost) {
              throw new ErrorWithStatus({
                message: 'Bài viết không tồn tại',
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            req.post = findPost
            return true
          }
        }
      }
    },
    ['params']
  )
)
