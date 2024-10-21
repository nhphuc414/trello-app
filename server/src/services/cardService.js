import { StatusCodes } from 'http-status-codes'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'

const createNew = async (data) => {
  const createdCard = await cardModel.createNew(data)
  const getNewCard = await cardModel.findOneById(createdCard.insertedId)
  if (getNewCard) {
    await columnModel.pushCardOrderIds(getNewCard)
  }
  return getNewCard
}
const update = async (id, data) => {
  const validData = {
    ...data,
    updateAt: Date.now()
  }
  return await cardModel.update(id, validData)
}

export const cardService = {
  createNew,
  update
}
