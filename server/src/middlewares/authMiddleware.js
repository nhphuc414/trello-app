import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  const accessTokenFromCookie = req.cookies?.accessToken
  if (!accessTokenFromCookie) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (Token not found!)')
    )
    return
  }
  try {
    req.jwtDecoded = await JwtProvider.verifyToken(
      accessTokenFromCookie,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    next()
  } catch (error) {
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token'))
      return
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! Please login!'))
  }
}

export const authMiddleware = {
  isAuthorized
}
