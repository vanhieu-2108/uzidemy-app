import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/model/Errors'
import {
  ChangePasswordReqBody,
  LoginReqBody,
  RegisterReqBody,
  TokenPayload,
  UpdateMeReqBody
} from '~/model/requests/User.requests'
import { EVerifyUser, IUser } from '~/model/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersServices from '~/services/users.services'
class UsersController {
  async register(req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response, next: NextFunction) {
    await usersServices.register(req.body)
    return res.json({
      message: 'Đăng ký tài khoản thành công'
    })
  }
  async login(req: Request<ParamsDictionary, any, LoginReqBody>, res: Response, next: NextFunction) {
    const result = await usersServices.login(req.user as IUser)
    return res.json({
      message: 'Đăng nhập thành công',
      result
    })
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_refresh_token as TokenPayload
    await usersServices.logout(user_id)
    return res.json({
      message: 'Đăng xuất thành công'
    })
  }
  async updateMe(req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_access_token as TokenPayload
    const result = await usersServices.updateMe(user_id, req.body)
    return res.json({
      message: 'Cập nhật thông tin tài khoản thành công',
      result
    })
  }
  async changePassword(req: Request<ParamsDictionary, any, ChangePasswordReqBody>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_access_token as TokenPayload
    const data = {
      new_password: req.body.new_password,
      confirm_new_password: req.body.confirm_new_password
    }
    await usersServices.changePassword(user_id, data)
    return res.json({
      message: 'Đổi mật khẩu thành công'
    })
  }
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    const result = await usersServices.getAllUsers()
    return res.json({
      message: 'Lấy danh sách người dùng thành công',
      result
    })
  }
  async getUserById(
    req: Request<{
      user_id: string
    }>,
    res: Response,
    next: NextFunction
  ) {
    const user = req.user as IUser
    return res.json({
      message: 'Lấy thông tin người dùng thành công',
      result: user
    })
  }
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const { refresh_token } = req.body
    const { user_id, exp } = req.decoded_refresh_token as TokenPayload
    const result = await usersServices.refreshToken(user_id, refresh_token, exp)
    return res.json({
      message: 'Refresh token thành công',
      result
    })
  }
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_email_verify_token as TokenPayload
    const findUser = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!findUser) {
      throw new ErrorWithStatus({
        message: 'Người dùng không tồn tại',
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    if (findUser.email_verify_token === '') {
      return res.json({
        message: 'Email đã được xác thực'
      })
    }
    const result = await usersServices.verifyEmail(user_id)
    return res.json(result)
  }
  async resendVerifyEmail(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_access_token as TokenPayload
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Người dùng không tồn tại'
      })
    }
    if (user.verify === EVerifyUser.VERIFIED) {
      return res.json({
        message: 'Email đã được xác thực'
      })
    }
    const result = await usersServices.resendVerifyEmail(user_id, user.email)
    return res.json(result)
  }
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body
    const { _id, verify, role } = req.user as any
    const result = await usersServices.forgotPassword({ _id, verify, role, email })
    return res.json(result)
  }
  async verifyForgotPassword(req: Request, res: Response, next: NextFunction) {
    return res.json({
      message: 'Xác nhận email đổi mật khẩu thành công'
    })
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_forgot_password_token as TokenPayload
    const { password } = req.body
    const result = await usersServices.resetPassword(user_id, password)
    return res.json(result)
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    console.log('123')
    const { user_id } = req.decoded_access_token as TokenPayload
    const result = await usersServices.getMe(user_id)
    return res.json(result)
  }
}
const usersController = new UsersController()
export default usersController
