import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_SORT_BY
} from '~/utils/constants'
import { slugify } from '~/utils/formatters'

const createNew = async (userId, data) => {
  const newData = {
    ...data,
    slug: slugify(data.title)
  }
  const createdBoard = await boardModel.createNew(userId, newData)
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
const getDetails = async (userId, boardId) => {
  const board = await boardModel.getDetails(userId, boardId)
  if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
  const resBoard = cloneDeep(board)
  resBoard.columns.forEach((column) => {
    column.cards = resBoard.cards.filter((card) => {
      return card.columnId.equals(column._id)
    })
  })
  delete resBoard.cards
  return resBoard
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
const getBoards = async (userId, page, itemsPerPage, sortBy) => {
  if (!page) page = DEFAULT_PAGE
  if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE
  if (!sortBy) sortBy = DEFAULT_SORT_BY
  return await boardModel.getBoards(
    userId,
    parseInt(page, 10),
    parseInt(itemsPerPage, 10),
    sortBy
  )
}
export const boardService = {
  createNew,
  getDetails,
  update,
  getBoards,
  moveCardToDifferentColumn
}
