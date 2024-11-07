import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
const createNew = async (req, res) => {
  const newBoard = await boardService.createNew(req.jwtDecoded._id, req.body)
  res.status(StatusCodes.CREATED).json(newBoard)
}
const update = async (req, res) => {
  const board = await boardService.update(req.params.id, req.body)
  res.status(StatusCodes.OK).json(board)
}
const getDetails = async (req, res) => {
  const board = await boardService.getDetails(req.jwtDecoded._id, req.params.id)
  res.status(StatusCodes.OK).json(board)
}
const moveCardToDifferentColumn = async (req, res) => {
  const result = await boardService.moveCardToDifferentColumn(req.body)
  res.status(StatusCodes.OK).json(result)
}
const getBoards = async (req, res) => {
  const userId = req.jwtDecoded._id
  const { page, itemsPerPage } = req.query
  const result = await boardService.getBoards(userId, page, itemsPerPage)
  res.status(StatusCodes.OK).json(result)
}

export const boardController = {
  createNew,
  getDetails,
  update,
  getBoards,
  moveCardToDifferentColumn
}
