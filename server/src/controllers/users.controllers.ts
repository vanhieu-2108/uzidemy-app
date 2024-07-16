import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  ChangePasswordReqBody,
  LoginReqBody,
  RegisterReqBody,
  TokenPayload,
  UpdateMeReqBody
} from '~/model/requests/User.requests'
import { IUser } from '~/model/schemas/User.schema'
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
}
const usersController = new UsersController()
export default usersController
