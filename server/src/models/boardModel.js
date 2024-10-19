import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(50).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  const createdBoard = await GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .insertOne(validData)
  return createdBoard
}

const findOneById = async (id) => {
  return await GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(`${id}`) })
}

const getDetails = async (id) => {
  const result = await GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${id}`),
          _destroy: false
        }
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
        $unwind: {
          path: '$columns',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: 'columns._id',
          foreignField: 'columnId',
          as: 'columns.cards'
        }
      },
      {
        $group: {
          _id: '$_id',
          root: { $first: '$$ROOT' },
          columns: { $push: '$columns' }
        }
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ['$root', { columns: '$columns' }] }
        }
      }
    ])
    .toArray()
  return result[0] || {}
}
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails
}
