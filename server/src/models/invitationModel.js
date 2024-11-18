import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { userModel } from './userModel'
import { boardModel } from './boardModel'

const INVITATION_COLLECTION_NAME = 'invitations'
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  type: Joi.string()
    .required()
    .valid(...Object.values(INVITATION_TYPES)),
  boardInvitation: Joi.object({
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string()
      .required()
      .valid(...Object.values(BOARD_INVITATION_STATUS))
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = [
  '_id',
  'inviterId',
  'inviteeId',
  'type',
  'createAt'
]
const validateBeforeCreate = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNewBoardInvitation = async (data) => {
  const validData = await validateBeforeCreate(data)
  let newInvitationToAdd = {
    ...validData,
    inviterId: new ObjectId(`${validData.inviterId}`),
    inviteeId: new ObjectId(`${validData.inviteeId}`)
  }
  if (validData.boardInvitation) {
    newInvitationToAdd.boardInvitation = {
      ...validData.boardInvitation,
      boardId: new ObjectId(`${validData.boardInvitation.boardId}`)
    }
  }
  const createdInvitation = await GET_DB()
    .collection(INVITATION_COLLECTION_NAME)
    .insertOne(newInvitationToAdd)
  return createdInvitation
}
const findOneById = async (invitationId) => {
  const res = await GET_DB()
    .collection(INVITATION_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(`${invitationId}`) })
  return res
}
const update = async (invitationId, updateData) => {
  INVALID_UPDATE_FIELDS.forEach((field) => {
    delete updateData[field]
  })
  if (updateData.boardInvitation) {
    updateData.boardInvitation = {
      ...updateData.boardInvitation,
      boardId: new ObjectId(`${updateData.boardInvitation.boardId}`)
    }
  }
  const res = await GET_DB()
    .collection(INVITATION_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(`${invitationId}`) },
      {
        $set: updateData
      },
      {
        returnDocument: 'after'
      }
    )
  return res
}
const findByUser = async (userId) => {
  const queryConditions = [
    { inviteeId: new ObjectId(`${userId}`) },
    {
      _destroy: false
    }
  ]
  const results = await GET_DB()
    .collection(INVITATION_COLLECTION_NAME)
    .aggregate([
      {
        $match: { $and: queryConditions }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviterId',
          foreignField: '_id',
          as: 'inviter',
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviteeId',
          foreignField: '_id',
          as: 'invitee',
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
        }
      },
      {
        $lookup: {
          from: boardModel.BOARD_COLLECTION_NAME,
          localField: 'boardInvitation.boardId',
          foreignField: '_id',
          as: 'board'
        }
      }
    ])
    .toArray()
  return results
}
export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  createNewBoardInvitation,
  findOneById,
  update,
  findByUser
}
