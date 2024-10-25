import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
const createNew = async (data) => {
  const existUser = await userModel.findOneByEmail(data.email)
  if (existUser)
    throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
  const nameFromEmail = data.email.split('@')[0]
  const newData = {
    email: data.email,
    password: bcryptjs.hashSync(data.password, 8),
    username: nameFromEmail,
    displayName: nameFromEmail,
    verifyToken: uuidv4()
  }
  const createdUser = await userModel.createNew(newData)
  const getNewUser = await userModel.findOneById(createdUser.insertedId)
  return getNewUser
}

export const userService = { createNew }
