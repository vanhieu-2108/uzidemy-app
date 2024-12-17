import { Router } from 'express'
import usersController from '~/controllers/users.controllers'
import { wrapHandler } from '~/utils/wrapHandler'
import {
  accessTokenValidator,
  changePasswordValidator,
  fotgotPasswordValidator,
  isAdminValidator,
  isIdSchemaMongoDB,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifyEmailValidator,
  verifyForgotPasswordValidator
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
 * Route verify email
 * [POST]: /users/verify-email
 * body: {
 * email_verify_token: string
 * }
 */

usersRouter.post('/verify-email', verifyEmailValidator, wrapHandler(usersController.verifyEmail))

/**
 * Route gửi lại email xác nhận
 * [POST]: /users/resend-verify-email
 * headers: {
 * Authorization: `Bearer <accessToken>`
 * }
 */

usersRouter.post('/resend-verify-email', accessTokenValidator, wrapHandler(usersController.resendVerifyEmail))

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
 * [PUT]: /users/update-me
 * Private route: Đây là route khi người dùng đã đăng nhập thì mới có thể truy cập
 * headers: {
 *  Authorization: `Bearer <accessToken>`
 * }
 * body: {
 *  fullname: string,
 *  password: string
 * }
 */
usersRouter.put('/update-me', accessTokenValidator, updateMeValidator, wrapHandler(usersController.updateMe))
/**
 * Route đổi mật khẩu
 * [PUT]: /users/change-password
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
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  changePasswordValidator,
  wrapHandler(usersController.changePassword)
)

/**
 * Route gửi email đổi mật khẩu
 * [POST]: /users/forgot-password
 * body: {
 * email: string
 * }
 */
usersRouter.post('/forgot-password', fotgotPasswordValidator, wrapHandler(usersController.forgotPassword))

/**
 * Route xác nhận email đổi mật khẩu
 * [POST]: /users/verify-forgot-password
 */

usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  wrapHandler(usersController.verifyForgotPassword)
)

/**
 * Route đặt lại mật khẩu
 * [POST]: /users/reset-password
 * body: {
 * new_password: string,
 * confirm_new_password: string
 * forgot_password_token: string
 * }
 */

usersRouter.post('/reset-password', resetPasswordValidator, wrapHandler(usersController.resetPassword))

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
 * Route lấy thông tin người dùng hiện tại
 * [GET]: /users/me
 */

usersRouter.get('/me', accessTokenValidator, wrapHandler(usersController.getMe))

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

/**
 * Route cập nhật người dùng theo id
 * [PUT]: /users/:user_id
 * Private route: Đây là route chỉ admin mới có thể truy cập
 */

usersRouter.put(
  '/:user_id',
  accessTokenValidator,
  isAdminValidator,
  isIdSchemaMongoDB,
  updateMeValidator,
  wrapHandler(usersController.updateUserById)
)

/**
 * Route xóa người dùng theo id
 * [DELETE]: /users/:user_id
 */

usersRouter.delete(
  '/:user_id',
  accessTokenValidator,
  isAdminValidator,
  isIdSchemaMongoDB,
  wrapHandler(usersController.deleteUserById)
)

export default usersRouter
