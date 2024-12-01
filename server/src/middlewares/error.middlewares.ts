import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/model/Errors'
export const defaultErrorHandler: ErrorRequestHandler = (error, req: Request, res: Response, next: NextFunction) => {
  try {
    if (error instanceof ErrorWithStatus) {
      return res.status(error.status).json(error)
    }
    const finalError: Record<string, any> = {}
    Object.getOwnPropertyNames(error).forEach((key) => {
      if (
        !Object.getOwnPropertyDescriptor(error, key)?.configurable ||
        !Object.getOwnPropertyDescriptor(error, key)?.writable
      ) {
        return
      }
      finalError[key] = error[key]
    })
    throw res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: finalError.message,
      errorInfo: finalError
    })
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      errorInfo: error
    })
  }
}
