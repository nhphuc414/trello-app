import { StatusCodes } from 'http-status-codes'
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
  res.status(StatusCodes.CREATED).json(result)
}

const refreshToken = async (req, res) => {
  const refreshTokenFromBody = req.body?.refreshToken
  try {
    const result = await userService.refreshToken(refreshTokenFromBody)
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
  const updatedUser = await userService.updateUser(userId, req.body)
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
