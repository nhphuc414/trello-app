import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'
const createNew = async (req, res, next) => {
  const newColumn = await columnService.createNew(req.body)
  res.status(StatusCodes.CREATED).json(newColumn)
}
const update = async (req, res, next) => {
  const column = await columnService.update(req.params.id, req.body)
  res.status(StatusCodes.OK).json(column)
}

const deleteItem = async (req, res, next) => {
  const result = await columnService.deleteItem(req.params.id)
  res.status(StatusCodes.OK).json(result)
}
export const columnController = {
  createNew,
  update,
  deleteItem
}
