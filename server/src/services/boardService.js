import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const createNew = async (data) => {
  const newData = {
    ...data,
    slug: slugify(data.title)
  }
  const createdBoard = await boardModel.createNew(newData)
  const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
  if (getNewBoard) {
    getNewBoard.columns = []
    getNewBoard.cards = []
  }
  return getNewBoard
}
const update = async (id, data) => {
  const validData = {
    ...data,
    updateAt: Date.now()
  }
  if (validData.title) {
    validData.slug = slugify(validData.title)
  }
  return await boardModel.update(id, validData)
}
const getDetails = async (id) => {
  const board = await boardModel.getDetails(id)
  if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
  // const resBoard = cloneDeep(board)
  // resBoard.columns.forEach((column) => {
  //   column.cards = resBoard.cards.filter((card) => card.columnId === column._id)
  // })
  return board
}
const moveCardToDifferentColumn = async (data) => {
  await columnModel.update(data.prevColumnId, {
    cardOrderIds: data.prevCardOrderIds,
    updateAt: Date.now()
  })
  await columnModel.update(data.nextColumnId, {
    cardOrderIds: data.nextCardOrderIds,
    updateAt: Date.now()
  })
  await cardModel.update(data.currentCardId, {
    columnId: data.nextColumnId
  })
  return { updateResullt: 'Successfully!' }
}
export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}
