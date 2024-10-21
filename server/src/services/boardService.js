import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  const newBoard = {
    ...reqBody,
    slug: slugify(reqBody.title)
  }
  const createdBoard = await boardModel.createNew(newBoard)
  const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
  if (getNewBoard) {
    getNewBoard.columns = []
    getNewBoard.cards = []
  }
  return getNewBoard
}
const getDetails = async (boardId) => {
  const board = await boardModel.getDetails(boardId)
  if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
  // const resBoard = cloneDeep(board)
  // resBoard.columns.forEach((column) => {
  //   column.cards = resBoard.cards.filter((card) => card.columnId === column._id)
  // })
  return board
}
export const boardService = {
  createNew,
  getDetails
}
