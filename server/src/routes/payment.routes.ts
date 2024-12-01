import { Router } from 'express'
import { createPaymentLinkValidator } from '~/middlewares/payment.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapHandler } from '~/utils/wrapHandler'
import paymentController from '~/controllers/payment.controllers'
const paymentRouter = Router()

/**
 * Route tạo link thanh toán
 * body: {
 * amount: number,
 * description: string,
 * course_id: string,
 * user_id: string
 * }
 */

paymentRouter.post(
  '/create-payment-link',
  accessTokenValidator,
  createPaymentLinkValidator,
  wrapHandler(paymentController.create)
)
paymentRouter.post('/receive-hook', wrapHandler(paymentController.receiveHook))

export default paymentRouter
