import Joi from 'joi'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE
} from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'
// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  cover: Joi.string().default(null),
  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  comments: Joi.array()
    .items({
      userId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
      userAvatar: Joi.string(),
      userDisplayName: Joi.string(),
      content: Joi.string(),
      commentedAt: Joi.date().timestamp()
    })
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['_id', 'createAt']
const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  return await GET_DB()
    .collection(CARD_COLLECTION_NAME)
    .insertOne({
      ...validData,
      boardId: new ObjectId(`${validData.boardId}`),
      columnId: new ObjectId(`${validData.columnId}`)
    })
}
const update = async (id, data) => {
  INVALID_UPDATE_FIELDS.forEach((field) => {
    delete data[field]
  })
  if (data.columnId) data.columnId = new ObjectId(`${data.columnId}`)
  if (data.boardId) data.boardId = new ObjectId(`${data.boardId}`)
  return await GET_DB()
    .collection(CARD_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(`${id}`) },
      { $set: data },
      { returnDocument: 'after' }
    )
}
const unshiftNewComment = async (id, data) => {
  return await GET_DB()
    .collection(CARD_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(`${id}`) },
      {
        $push: { comments: { $each: [data], $position: 0 } }
      },
      { returnDocument: 'after' }
    )
}
const findOneById = async (id) => {
  return await GET_DB()
    .collection(CARD_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(`${id}`) })
}
const deleteManyByColumnId = async (columnId) => {
  return await GET_DB()
    .collection(CARD_COLLECTION_NAME)
    .deleteMany({ columnId: new ObjectId(`${columnId}`) })
}
const updateMembers = async (cardId, incomingMemberInfo) => {
  let updateCondition = {}
  if (incomingMemberInfo.action === CARD_MEMBER_ACTIONS.ADD) {
    updateCondition = {
      $push: { memberIds: new ObjectId(`${incomingMemberInfo.userId}`) }
    }
  } else if (incomingMemberInfo.action === CARD_MEMBER_ACTIONS.REMOVE) {
    updateCondition = {
      $pull: { memberIds: new ObjectId(`${incomingMemberInfo.userId}`) }
    }
  }
  const res = await GET_DB()
    .collection(CARD_COLLECTION_NAME)
    .findOneAndUpdate({ _id: new ObjectId(`${cardId}`) }, updateCondition, {
      returnDocument: 'after'
    })
  return res
}
export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  unshiftNewComment,
  update,
  deleteManyByColumnId,
  updateMembers
}
