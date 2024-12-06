import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'

const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string()
    .valid(...Object.values(USER_ROLES))
    .default(USER_ROLES.CLIENT),
  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}
const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  const createdUser = await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .insertOne(validData)
  return createdUser
}
const findOneById = async (id) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(`${id}`) })
}
const findOneByEmail = async (email) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .findOne({ email: email })
}
const update = async (id, data) => {
  INVALID_UPDATE_FIELDS.forEach((field) => {
    delete data[field]
  })
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(`${id}`) },
      { $set: data },
      { returnDocument: 'after' }
    )
}
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByEmail,
  update
}
