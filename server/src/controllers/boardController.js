import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
const createNew = async (req, res, next) => {
  const newBoard = await boardService.createNew(req.body)
  res.status(StatusCodes.CREATED).json(newBoard)
}
const update = async (req, res, next) => {
  const board = await boardService.update(req.params.id, req.body)
  res.status(StatusCodes.OK).json(board)
}
const getDetails = async (req, res, next) => {
  const board = await boardService.getDetails(req.params.id)
  res.status(StatusCodes.OK).json(board)
}
const moveCardToDifferentColumn = async (req, res, next) => {
  const result = await boardService.moveCardToDifferentColumn(req.body)
  res.status(StatusCodes.OK).json(result)
}
export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}
