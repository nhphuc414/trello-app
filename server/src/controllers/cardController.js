import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
const createNew = async (req, res) => {
  const newCard = await cardService.createNew(req.body)
  res.status(StatusCodes.CREATED).json(newCard)
}
const update = async (req, res) => {
  const card = await cardService.update(req.params.id, req.body)
  res.status(StatusCodes.OK).json(card)
}

export const cardController = {
  createNew,
  update
}
