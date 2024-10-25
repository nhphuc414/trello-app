import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
// eslint-disable-next-line no-unused-vars
export const errorHandlingMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack
  }
  // console.log(responseError)
  if (env.BUILD_MODE !== 'dev') {
    delete responseError.stack
  } else console.log(responseError.stack)
  res.status(responseError.statusCode).json(responseError)
}
