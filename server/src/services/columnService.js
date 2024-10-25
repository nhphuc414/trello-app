import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (data) => {
  const createdColumn = await columnModel.createNew(data)
  const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)
  if (getNewColumn) {
    getNewColumn.cards = []
    await boardModel.pushColumnOrderIds(getNewColumn)
  }
  return getNewColumn
}
const update = async (id, data) => {
  const validData = {
    ...data,
    updateAt: Date.now()
  }
  return await columnModel.update(id, validData)
}
const deleteItem = async (id) => {
  const column = await columnModel.findOneById(id)
  await boardModel.pullColumnOrderIds(column)
  await columnModel.deleteOneById(id)
  await cardModel.deleteManyByColumnId(id)
  return { deleteResult: 'Column and its Cards deleted successfully!!' }
}
export const columnService = {
  createNew,
  update,
  deleteItem
}
