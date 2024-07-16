import { Router } from 'express'
import usersController from '~/controllers/users.controllers'
import { wrapHandler } from '~/utils/wrapHandler'
import {
  accessTokenValidator,
  changePasswordValidator,
  isAdminValidator,
  isIdSchemaMongoDB,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  updateMeValidator
} from '~/middlewares/users.middlewares'
const usersRouter = Router()
/**
 * Route đăng ký tài khoản
 * [POST]: /users/register
 * body: {
 *  email: string,
 *  fullname: string,
 *  password: string,
 *  confirm_password: string
 * }
 */
usersRouter.post('/register', registerValidator, wrapHandler(usersController.register))
/**
 * Route đăng nhập
 * [POST]: /users/login
 * body: {
 * email: string,
 * password: string
 * }
 */
usersRouter.post('/login', loginValidator, wrapHandler(usersController.login))

/**
 * Route đăng xuất
 * [POST]: /users/logout
 * body: {
 * refresh_token: string
 * }
 */
usersRouter.post('/logout', refreshTokenValidator, wrapHandler(usersController.logout))
/**
 * Route cập nhật thông tin người dùng
 * [POST]: /users/update-me
 * Private route: Đây là route khi người dùng đã đăng nhập thì mới có thể truy cập
 * headers: {
 *  Authorization: `Bearer <accessToken>`
 * }
 * body: {
 *  fullname: string,
 *  password: string
 * }
 */
usersRouter.post('/update-me', accessTokenValidator, updateMeValidator, wrapHandler(usersController.updateMe))
/**
 * Route đổi mật khẩu
 * [POST]: /users/change-password
 * Private route: Đây là route khi người dùng đã đăng nhập thì mới có thể truy cập
 * headers: {
 * Authorization: `Bearer <accessToken>`
 * }
 * body: {
 * old_password: string,
 * new_password: string,
 * confirm_new_password: string
 * }
 */
usersRouter.post(
  '/change-password',
  accessTokenValidator,
  changePasswordValidator,
  wrapHandler(usersController.changePassword)
)
/**
 * Route lấy tất cả người dùng
 * [GET]: /users
 * Private route: Đây là route chỉ admin mới có thể truy cập
 * headers: {
 * Authorization: `Bearer <accessToken>`
 * }
 */
usersRouter.get('/', accessTokenValidator, isAdminValidator, wrapHandler(usersController.getAllUsers))
/**
 * Route lấy thông tin người dùng
 * [GET]: /users/:user_id
 * Private route: Đây là route chỉ khi người dùng đã đăng nhập thì mới có thể truy cập
 * headers: {
 * Authorization: `Bearer <accessToken>`
 * }
 * params: {
 * user_id: string
 * }
 */
usersRouter.get('/:user_id', accessTokenValidator, isIdSchemaMongoDB, wrapHandler(usersController.getUserById))

/**
 * Route refresh token
 * [POST]: /users/refresh-token
 * body: {
 * refresh_token: string
 * }
 */

usersRouter.post('/refresh-token', refreshTokenValidator, wrapHandler(usersController.refreshToken))

export default usersRouter
