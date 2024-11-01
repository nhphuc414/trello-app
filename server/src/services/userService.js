import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import { CloudinaryProvider } from '~/providers/cloudinaryProvider'
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

  const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
  const customSubject =
    'Trello: Please verify your email before using our services!'
  const htmlContent = `
    <h3>Here is your verification link</h3>
    <h3>${verificationLink}</h3>
    <h3>Sincerely,<br/> - Nguyen Hong Phuc - </h3>
  `
  await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)
  return pickUser(getNewUser)
}
const verifyAccount = async (data) => {
  const existUser = await userModel.findOneByEmail(data.email)
  if (!existUser)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
  if (existUser.isActive)
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      'Your account is already active!'
    )
  if (data.token !== existUser.verifyToken)
    throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')
  const updateData = {
    isActive: true,
    verifyToken: null
  }
  const updatedUser = await userModel.update(existUser._id, updateData)
  return pickUser(updatedUser)
}

const login = async (data) => {
  const existUser = await userModel.findOneByEmail(data.email)
  if (!existUser)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
  if (!existUser.isActive)
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      'Your account is not active!'
    )

  if (!bcryptjs.compareSync(data.password, existUser.password))
    throw new ApiError(StatusCodes.NOT_FOUND, 'Wrong email or password!')

  const userInfo = {
    _id: existUser._id,
    email: existUser.email
  }
  const accessToken = await JwtProvider.generateToken(
    userInfo,
    env.ACCESS_TOKEN_SECRET_SIGNATURE,
    env.ACCESS_TOKEN_LIFE
  )
  const refreshToken = await JwtProvider.generateToken(
    userInfo,
    env.REFRESH_TOKEN_SECRET_SIGNATURE,
    env.REFRESH_TOKEN_LIFE
  )
  return { accessToken, refreshToken, ...pickUser(existUser) }
}
const refreshToken = async (data) => {
  const refreshTokenDecoded = await JwtProvider.verifyToken(
    data,
    env.REFRESH_TOKEN_SECRET_SIGNATURE
  )
  const userInfo = {
    _id: refreshTokenDecoded._id,
    email: refreshTokenDecoded.email
  }
  const accessToken = await JwtProvider.generateToken(
    userInfo,
    env.ACCESS_TOKEN_SECRET_SIGNATURE,
    env.ACCESS_TOKEN_LIFE
  )
  return { accessToken }
}
const updateUser = async (id, data, userAvatarFile) => {
  const existUser = await userModel.findOneById(id)
  if (!existUser)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
  let updatedUser = {}
  if (data.current_password && data.new_password) {
    if (!bcryptjs.compareSync(data.current_password, existUser.password))
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Your current password is incorrect!'
      )
    updatedUser = await userModel.update(id, {
      password: bcryptjs.hashSync(data.new_password, 8)
    })
  } else if (userAvatarFile) {
    const updateResult = await CloudinaryProvider.uploadStream(
      userAvatarFile.buffer,
      'users'
    )
    updatedUser = await userModel.update(id, {
      avatar: updateResult.secure_url
    })
  } else {
    updatedUser = await userModel.update(id, data)
  }
  return pickUser(updatedUser)
}
export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  updateUser
}
