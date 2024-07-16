import HTTP_STATUS from '~/constants/httpStatus'

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

type ErrorTypes = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

export class EntityError extends ErrorWithStatus {
  errors: ErrorTypes
  constructor({ message = 'Validation error', errors }: { message?: string; status?: number; errors: ErrorTypes }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
