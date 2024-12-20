import { Request, Response } from 'express'
import PayOS from '@payos/node'
import envConfig, { env } from '~/utils/config'
import { CheckoutRequestType, WebhookDataType } from '@payos/node/lib/type'
import databaseService from '~/services/database.services'
import Order, { EStatus } from '~/model/schemas/Order.schema'
import { ObjectId } from 'mongodb'
const payos = new PayOS(envConfig.payosCLientId, envConfig.payosApiKey, envConfig.payosChecksumKey)
class PaymentController {
  async create(req: Request, res: Response) {
    let orderCode
    let findOrder
    do {
      orderCode = Math.floor(Math.random() * 1000000)
      findOrder = await payos.getPaymentLinkInformation(orderCode).catch(() => false)
    } while (findOrder)
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const expirationTimestamp = currentTimestamp + 300 // 5 minutes
    const order: CheckoutRequestType = {
      amount: req.body.amount,
      orderCode,
      description: req.body.description || 'Thanh toán khóa học',
      returnUrl: env === 'dev' ? `${envConfig.hostClient}` : 'http://localhost:3000',
      cancelUrl: env === 'dev' ? `${envConfig.hostClient}` : 'http://localhost:3000',
      expiredAt: expirationTimestamp
    }
    const paymentLink = await payos.createPaymentLink(order)
    databaseService.orders.insertOne(
      new Order({
        order_id: orderCode,
        price: order.amount,
        status: paymentLink.status as any,
        course_id: new ObjectId(req.body.course_id),
        user_id: new ObjectId(req.body.user_id)
      })
    )
    return res.json({
      message: 'Tạo link thanh toán thành công',
      result: {
        checkoutURL: paymentLink.checkoutUrl
      }
    })
  }
  async receiveHook(req: Request, res: Response) {
    const data = req.body
    const { code, desc, orderCode } = data.data as WebhookDataType
    if (code === '00' && desc === 'success') {
      const orderUpdateResult = await databaseService.orders.updateOne(
        {
          order_id: orderCode
        },
        {
          $set: {
            status: EStatus.SUCCESS
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
      if (orderUpdateResult.matchedCount > 0) {
        const order = await databaseService.orders.findOne({ order_id: orderCode })
        const course_id = order?.course_id
        const user_id = order?.user_id
        if (course_id && user_id) {
          await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, { $push: { courses: course_id } })
        }
      }
    }

    res.json() // Trả lại phản hồi
  }
}

const paymentController = new PaymentController()
export default paymentController
