import { NextFunction, Request, Response } from 'express'
import { checkSchema, ParamSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ObjectId, WithId } from 'mongodb'
import { ERole } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/model/Errors'
import { TokenPayload } from '~/model/requests/User.requests'
import User from '~/model/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersServices from '~/services/users.services'
import envConfig from '~/utils/config'
import { verifyPassword, verifyToken } from '~/utils/utils'
import validate from '~/utils/validation'

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Mật khẩu không được để trống'
  },
  isLength: {
    options: {
      min: 6,
      max: 100
    },
    errorMessage: 'Mật khẩu phải từ 6 đến 100 ký tự'
  }
}

const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Nhập lại mật khẩu không được để trống'
  },
  isLength: {
    options: {
      min: 6,
      max: 100
    },
    errorMessage: 'Nhập lại mật khẩu phải từ 6 đến 100 ký tự'
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Mật khẩu nhập lại không khớp')
      }
      return true
    }
  }
}

const forgotPasswordTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: 'Forgot password token là bắt buộc',
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      try {
        const decoded_forgot_password_token = await verifyToken({
          token: value,
          privateKey: envConfig.forgotPasswordSecret
        })
        const { user_id } = decoded_forgot_password_token
        const findUser = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
        if (!findUser) {
          throw new ErrorWithStatus({
            message: 'Người dùng không tồn tại',
            status: HTTP_STATUS.NOT_FOUND
          })
        }
        if (value !== findUser.forgot_password_token) {
          throw new ErrorWithStatus({
            message: 'Forgot password token không đúng',
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        req.decoded_forgot_password_token = decoded_forgot_password_token
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: error.message,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        throw error
      }
      return true
    }
  }
}

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: 'Email không được để trống'
        },
        isEmail: {
          errorMessage: 'Email không đúng định dạng'
        },
        custom: {
          options: async (value) => {
            const findUser = await usersServices.findUserByEmail(value)
            if (findUser) {
              throw new Error('Email đã tồn tại')
            }
            return true
          }
        }
      },
      fullname: {
        notEmpty: {
          errorMessage: 'Họ tên không được để trống'
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: 'Họ tên phải từ 6 đến 50 ký tự'
        }
      },
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)

export const verifyEmailValidator = validate(
  checkSchema({
    email_verify_token: {
      trim: true,
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              message: 'Email verify token là bắt buộc',
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          try {
            const decoded_email_verify_token = await verifyToken({
              token: value,
              privateKey: envConfig.emailSecret
            })
            const { user_id } = decoded_email_verify_token
            const findUser = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
            if (!findUser) {
              throw new ErrorWithStatus({
                message: 'Người dùng không tồn tại',
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            if (value !== findUser.email_verify_token) {
              throw new ErrorWithStatus({
                message: 'Email verify token không đúng',
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
          } catch (error) {
            throw new ErrorWithStatus({
              message: (error as JsonWebTokenError).message,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          return true
        }
      }
    }
  })
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: 'Email không được để trống'
        },
        isEmail: {
          errorMessage: 'Email không đúng định dạng'
        },
        custom: {
          options: async (value, { req }) => {
            const findUser = await usersServices.findUserByEmail(value)
            if (!findUser) {
              throw new Error('Email không tồn tại')
            }
            const compare = await verifyPassword(req.body.password, findUser.password)
            if (!compare) {
              throw new Error('Email hoặc mật khẩu không đúng')
            }
            req.user = findUser
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: 'Mật khẩu không được để trống'
        },
        isLength: {
          options: {
            min: 6,
            max: 100
          },
          errorMessage: 'Mật khẩu phải từ 6 đến 100 ký tự'
        }
      }
    },
    ['body']
  )
)
export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const access_token = value.split(' ')[1] as string
            if (!access_token) {
              throw new ErrorWithStatus({
                message: 'Access token là bắt buộc',
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_access_token = await verifyToken({
                token: access_token,
                privateKey: envConfig.accessTokenSecret
              })
              req.decoded_access_token = decoded_access_token
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: 'Refresh token là bắt buộc',
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const findToken = await databaseService.refreshTokens.findOne({ token: value })
            if (!findToken) {
              throw new ErrorWithStatus({
                message: 'Refresh token không tồn tại',
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_refresh_token = await verifyToken({
                token: value,
                privateKey: envConfig.refreshTokenSecret
              })
              const { exp } = decoded_refresh_token
              const now = new Date().getTime() / 1000
              if (exp - now <= 0) {
                throw new ErrorWithStatus({
                  message: 'Refresh token đã hết hạn',
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: HTTP_STATUS.UNAUTHORIZED
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

export const updateMeValidator = validate(
  checkSchema(
    {
      fullname: {
        notEmpty: {
          errorMessage: 'Họ tên không được để trống'
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: 'Họ tên phải từ 6 đến 50 ký tự'
        }
      },
      avatar: {
        optional: true,
        isString: {
          errorMessage: 'Avatar phải là chuỗi'
        },
        trim: true,
        isLength: {
          options: {
            min: 0,
            max: 400
          },
          errorMessage: 'Avatar phải từ 0 đến 400 ký tự'
        }
      },
      email: {
        isEmail: {
          errorMessage: 'Email không đúng định dạng'
        }
      }
    },
    ['body']
  )
)
export const changePasswordValidator = validate(
  checkSchema(
    {
      old_password: {
        notEmpty: {
          errorMessage: 'Mật khẩu cũ không được để trống'
        },
        isLength: {
          options: { min: 6, max: 100 },
          errorMessage: 'Mật khẩu cũ phải từ 6 đến 100 ký tự'
        },
        custom: {
          options: async (value, { req }) => {
            if (!value || typeof value !== 'string') {
              throw new Error('Mật khẩu cũ không hợp lệ')
            }
            const { user_id } = (req as Request).decoded_access_token as TokenPayload
            const user = (await usersServices.getUserById(user_id)) as WithId<User>
            const compare = await verifyPassword(value, user.password)
            if (!compare) {
              throw new Error('Mật khẩu cũ không đúng')
            }
            return true
          }
        }
      },
      new_password: {
        notEmpty: {
          errorMessage: 'Mật khẩu mới không được để trống'
        },
        isLength: {
          options: {
            min: 6,
            max: 100
          },
          errorMessage: 'Mật khẩu mới phải từ 6 đến 100 ký tự'
        }
      },
      confirm_new_password: {
        notEmpty: {
          errorMessage: 'Nhập lại mật khẩu mới không được để trống'
        },
        isLength: {
          options: {
            min: 6,
            max: 100
          },
          errorMessage: 'Nhập lại mật khẩu mới phải từ 6 đến 100 ký tự'
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.new_password) {
              throw new Error('Mật khẩu nhập lại không khớp')
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const isAdminValidator = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.decoded_access_token as TokenPayload
  if (role !== ERole.ADMIN) {
    throw new ErrorWithStatus({
      message: 'Bạn không có quyền truy cập',
      status: HTTP_STATUS.FORBIDDEN
    })
  }
  next()
}
export const isIdSchemaMongoDB = validate(
  checkSchema(
    {
      user_id: {
        isMongoId: {
          errorMessage: 'Id không đúng định dạng'
        },
        custom: {
          options: async (value, { req }) => {
            const user = await usersServices.getUserById(value)
            if (!user) {
              throw new ErrorWithStatus({
                message: 'Người dùng không tồn tại',
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const fotgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: 'Email không được để trống'
        },
        isEmail: {
          errorMessage: 'Email không đúng định dạng'
        },
        custom: {
          options: async (value, { req }) => {
            const findUser = await usersServices.findUserByEmail(value)
            if (!findUser) {
              throw new ErrorWithStatus({
                message: 'Email không tồn tại',
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            req.user = findUser
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)
