import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { EObjectTypeComment } from '~/constants/enums'
import databaseService from '~/services/database.services'
import validate from '~/utils/validation'

export const createCommentValidator = validate(
  checkSchema(
    {
      parent_id: {
        optional: true,
        notEmpty: {
          errorMessage: 'Parent ID không được để trống'
        },
        isMongoId: {
          errorMessage: 'Parent ID không hợp lệ'
        },
        custom: {
          options: async (value) => {
            const findComment = await databaseService.comments.findOne({
              _id: new ObjectId(value)
            })
            if (!findComment) {
              throw new Error('Comment không tồn tại')
            }
          }
        }
      },
      object_id: {
        notEmpty: {
          errorMessage: 'Object ID không được để trống'
        },
        isMongoId: {
          errorMessage: 'Object ID không hợp lệ'
        },
        custom: {
          options: async (value, { req }) => {
            if (EObjectTypeComment.LECTURE === req.body.object_type) {
              const findLecture = await databaseService.lectures.findOne({
                _id: new ObjectId(value)
              })
              if (!findLecture) {
                throw new Error('Bài giảng không tồn tại')
              }
            }
          }
        }
      },
      object_type: {
        notEmpty: {
          errorMessage: 'Object type không được để trống'
        },
        isIn: {
          options: [Object.values(EObjectTypeComment)],
          errorMessage: 'Object type không hợp lệ'
        }
      },
      content: {
        notEmpty: {
          errorMessage: 'Nội dung không được để trống'
        },
        isString: {
          errorMessage: 'Nội dung phải là chuỗi'
        }
      }
    },
    ['body']
  )
)

export const updateCommentValidator = validate(
  checkSchema(
    {
      comment_id: {
        notEmpty: {
          errorMessage: 'Comment ID không được để trống'
        },
        isMongoId: {
          errorMessage: 'Comment ID không hợp lệ'
        },
        custom: {
          options: async (value) => {
            const findComment = await databaseService.comments.findOne({
              _id: new ObjectId(value)
            })
            if (!findComment) {
              throw new Error('Comment không tồn tại')
            }
            return true
          }
        }
      },
      parent_id: {
        optional: true,
        notEmpty: {
          errorMessage: 'Parent ID không được để trống'
        },
        isMongoId: {
          errorMessage: 'Parent ID không hợp lệ'
        },
        custom: {
          options: async (value) => {
            const findComment = await databaseService.comments.findOne({
              _id: new ObjectId(value)
            })
            if (!findComment) {
              throw new Error('Comment không tồn tại')
            }
          }
        }
      },
      object_id: {
        notEmpty: {
          errorMessage: 'Object ID không được để trống'
        },
        isMongoId: {
          errorMessage: 'Object ID không hợp lệ'
        },
        custom: {
          options: async (value, { req }) => {
            if (EObjectTypeComment.LECTURE === req.body.object_type) {
              const findLecture = await databaseService.lectures.findOne({
                _id: new ObjectId(value)
              })
              if (!findLecture) {
                throw new Error('Bài giảng không tồn tại')
              }
            }
          }
        }
      },
      object_type: {
        notEmpty: {
          errorMessage: 'Object type không được để trống'
        },
        isIn: {
          options: [Object.values(EObjectTypeComment)],
          errorMessage: 'Object type không hợp lệ'
        }
      },
      content: {
        notEmpty: {
          errorMessage: 'Nội dung không được để trống'
        },
        isString: {
          errorMessage: 'Nội dung phải là chuỗi'
        }
      }
    },
    ['params', 'body']
  )
)

export const deleteCommentValidator = validate(
  checkSchema(
    {
      comment_id: {
        notEmpty: {
          errorMessage: 'Comment ID không được để trống'
        },
        isMongoId: {
          errorMessage: 'Comment ID không hợp lệ'
        },
        custom: {
          options: async (value) => {
            const findComment = await databaseService.comments.findOne({
              _id: new ObjectId(value)
            })
            if (!findComment) {
              throw new Error('Comment không tồn tại')
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const getCommentsByObjectIdValidator = validate(
  checkSchema({
    object_id: {
      notEmpty: {
        errorMessage: 'Object ID không được để trống'
      },
      isMongoId: {
        errorMessage: 'Object ID không hợp lệ'
      },
      custom: {
        options: async (value, { req }) => {
          if (EObjectTypeComment.LECTURE === req.body.object_type) {
            const findLecture = await databaseService.lectures.findOne({
              _id: new ObjectId(value)
            })
            if (!findLecture) {
              throw new Error('Bài giảng không tồn tại')
            }
          }
        }
      }
    }
  })
)
