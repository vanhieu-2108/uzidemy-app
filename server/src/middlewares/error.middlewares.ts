import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/model/Errors'

export const defaultErrorHandler: ErrorRequestHandler = (error, req: Request, res: Response, next: NextFunction) => {
  try {
    if (error instanceof ErrorWithStatus) {
      return res.status(error.status).json(error)
    }
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      errorInfo: error
    })
  }
}
