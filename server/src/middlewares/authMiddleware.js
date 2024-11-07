import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'

const isAuthorized = async (req, res, next) => {
  const accessTokenFromHeader = req.headers.authorization
  if (!accessTokenFromHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized! (Token not found!)' })
  }
  try {
    req.jwtDecoded = await JwtProvider.verifyToken(
      accessTokenFromHeader.split(' ')[1],
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    next()
  } catch (error) {
    if (error.message?.includes('jwt expired')) {
      return res
        .status(StatusCodes.GONE)
        .json({ message: 'Need to refresh token' })
    }
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized! Please login!' })
  }
}

export const authMiddleware = {
  isAuthorized
}
