import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
const createNew = async (req, res, next) => {
  const newCard = await cardService.createNew(req.body)
  res.status(StatusCodes.CREATED).json(newCard)
}
const update = async (req, res, next) => {
  const card = await cardService.update(req.params.id, req.body)
  res.status(StatusCodes.OK).json(card)
}

export const cardController = {
  createNew,
  update
}
