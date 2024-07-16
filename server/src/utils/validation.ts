import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/model/Errors'
const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Chạy validation để kiểm tra lỗi
    await validation.run(req)
    // Lấy ra các lỗi nếu có
    const errors = validationResult(req)
    // Chuyển các lỗi thành object
    const errorsObject = errors.mapped()
    // Tạo một entityError để chứa các lỗi
    const entityError = new EntityError({ errors: {} })
    // Không có lỗi thì next để chạy đến requestHandler tiếp theo
    if (errors.isEmpty()) {
      return next()
    }
    // Nếu có lỗi thì kiểm tra xem có lỗi nào không phải là lỗi Unprocessable Entity không
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      // Nếu có lỗi không phải là lỗi Unprocessable Entity thì next lỗi đó
      // Ví dụ: lỗi Unauthorized, Internal Server Error thì next luôn lỗi đó
      // Và Error middleware sẽ xử lý lỗi đó
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        next(msg)
      }
      // Nếu không thì thêm lỗi vào entityError
      entityError.errors[key] = errorsObject[key]
    }
    // Nếu là lỗi Unprocessable Entity thì next entityError
    // Và Error middleware sẽ xử lý lỗi đó
    next(entityError)
  }
}
export default validate
