import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  const createdColumn = await columnModel.createNew(reqBody)
  const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)
  if (getNewColumn) {
    getNewColumn.cards = []
    await boardModel.pushColumnOrderIds(getNewColumn)
  }
  return getNewColumn
}
const getDetails = async (columnId) => {
  const column = await columnModel.getDetails(columnId)
  if (!column) throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
  // const rescolumn = cloneDeep(column)
  // rescolumn.columns.forEach((column) => {
  //   column.cards = rescolumn.cards.filter((card) => card.columnId === column._id)
  // })
  return column
}
export const columnService = {
  createNew,
  getDetails
}
