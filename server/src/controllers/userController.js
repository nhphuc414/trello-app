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

export const userController = {
  createNew,
  verifyAccount,
  login
}
