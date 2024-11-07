import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
import { pagingSkipValue } from '~/utils/algorithms'
import { userModel } from './userModel'
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(50).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  ownerIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['_id', 'createAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (userId, data) => {
  const validData = await validateBeforeCreate(data)
  const newBoardToAdd = {
    ...validData,
    ownerIds: [new ObjectId(`${userId}`)]
  }
  return await GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .insertOne(newBoardToAdd)
}
const update = async (id, data) => {
  INVALID_UPDATE_FIELDS.forEach((field) => {
    delete data[field]
  })
  if (data.columnOrderIds)
    data.columnOrderIds = data.columnOrderIds.map(
      (item) => new ObjectId(`${item}`)
    )
  return await GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(`${id}`) },
      { $set: data },
      { returnDocument: 'after' }
    )
}
const findOneById = async (id) => {
  return await GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(`${id}`) })
}
const pushColumnOrderIds = async (column) => {
  return (
    (await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(`${column.boardId}`)
        },
        { $push: { columnOrderIds: new ObjectId(`${column._id}`) } },
        { returnDocument: 'after' }
      )) || null
  )
}
const pullColumnOrderIds = async (column) => {
  return (
    (await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(`${column.boardId}`)
        },
        { $pull: { columnOrderIds: new ObjectId(`${column._id}`) } },
        { returnDocument: 'after' }
      )) || null
  )
}
const getDetails = async (userId, boardId) => {
  const queryConditions = [
    { _id: new ObjectId(`${boardId}`) },
    {
      _destroy: false
    },
    {
      $or: [
        { ownerIds: { $all: [new ObjectId(`${userId}`)] } },
        { memberIds: { $all: [new ObjectId(`${userId}`)] } }
      ]
    }
  ]
  const result = await GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .aggregate([
      {
        $match: { $and: queryConditions }
      },
      {
        $lookup: {
          from: columnModel.COLUMN_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns'
        }
      },
      {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'ownerIds',
          foreignField: '_id',
          as: 'owners',
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'memberIds',
          foreignField: '_id',
          as: 'members',
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
        }
      }
    ])
    .toArray()
  return result[0] || null
}
const getBoards = async (userId, page, itemsPerPage) => {
  const queryConditions = [
    {
      _destroy: false
    },
    {
      $or: [
        { ownerIds: { $all: [new ObjectId(`${userId}`)] } },
        { memberIds: { $all: [new ObjectId(`${userId}`)] } }
      ]
    }
  ]
  const query = await GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .aggregate(
      [
        { $match: { $and: queryConditions } },
        {
          $sort: { title: 1 }
        },
        {
          $facet: {
            queryBoards: [
              { $skip: pagingSkipValue(page, itemsPerPage) },
              { $limit: itemsPerPage }
            ],
            queryTotalBoards: [{ $count: 'countedAllBoards' }]
          }
        }
      ],
      { collation: { locale: 'en' } }
    )
    .toArray()
  const res = query[0]
  return {
    boards: res.queryBoards || [],
    totalBoards: res.queryTotalBoards[0]?.countedAllBoards || 0
  }
}
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  pullColumnOrderIds,
  update,
  getBoards
}
