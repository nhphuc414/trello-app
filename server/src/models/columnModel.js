import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  cardOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}
//================== INVALID FIELD ==================//
const INVALID_UPDATE_FIELDS = ['_id', 'createAt']
//================== CREATE NEW ==================//
const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  return await GET_DB()
    .collection(COLUMN_COLLECTION_NAME)
    .insertOne({ ...validData, boardId: new ObjectId(`${validData.boardId}`) })
}
//================== UPDATE COLUMN ==================//
const update = async (id, data) => {
  INVALID_UPDATE_FIELDS.forEach((field) => {
    delete data[field]
  })
  if (data.cardOrderIds)
    data.cardOrderIds = data.cardOrderIds.map((item) => new ObjectId(`${item}`))
  return await GET_DB()
    .collection(COLUMN_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(`${id}`) },
      { $set: data },
      { returnDocument: 'after' }
    )
}
//================== UPDATE CARD ==================//
const pushCardOrderIds = async (card) => {
  return (
    (await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(`${card.columnId}`)
        },
        { $push: { cardOrderIds: new ObjectId(`${card._id}`) } },
        { returnDocument: 'after' }
      )) || null
  )
}
//================== FIND BY ID ==================//
const findOneById = async (id) => {
  return await GET_DB()
    .collection(COLUMN_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(`${id}`) })
}

const deleteOneById = async (id) => {
  return await GET_DB()
    .collection(COLUMN_COLLECTION_NAME)
    .deleteOne({ _id: new ObjectId(`${id}`) })
}
export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds,
  update,
  deleteOneById
}
