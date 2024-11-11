import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { userService } from '~/services/userService'

const createNew = async (req, res) => {
  const createdUser = await userService.createNew(req.body)
  res.status(StatusCodes.CREATED).json(createdUser)
}

const verifyAccount = async (req, res) => {
  const result = await userService.verifyAccount(req.body)
  res.status(StatusCodes.CREATED).json(result)
}

const login = async (req, res) => {
  const result = await userService.login(req.body)

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days')
  })
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days')
  })
  res.status(StatusCodes.CREATED).json(result.userInfo)
}

const refreshToken = async (req, res) => {
  const refreshTokenFromCookie = req.cookies?.refreshToken
  try {
    const result = await userService.refreshToken(refreshTokenFromCookie)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized! Please login!' })
  }
}
const logout = async (req, res) => {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  res.status(StatusCodes.OK).json({ loggedOut: true })
}
const updateUser = async (req, res) => {
  const userId = req.jwtDecoded._id
  const userAvatarFile = req.file
  const updatedUser = await userService.updateUser(
    userId,
    req.body,
    userAvatarFile
  )
  res.status(StatusCodes.OK).json(updatedUser)
}
export const userController = {
  createNew,
  verifyAccount,
  login,
  logout,
  refreshToken,
  updateUser
}
