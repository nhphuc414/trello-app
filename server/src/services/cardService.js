import { StatusCodes } from 'http-status-codes'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  const createdCard = await cardModel.createNew(reqBody)
  const getNewCard = await cardModel.findOneById(createdCard.insertedId)

  return getNewCard
}
const getDetails = async (cardId) => {
  const card = await cardModel.getDetails(cardId)
  if (!card) throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
  // const rescard = cloneDeep(card)
  // rescard.columns.forEach((column) => {
  //   column.cards = rescard.cards.filter((card) => card.columnId === column._id)
  // })
  return card
}
export const cardService = {
  createNew,
  getDetails
}
