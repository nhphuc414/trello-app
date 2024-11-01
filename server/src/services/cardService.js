import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/cloudinaryProvider'

const createNew = async (data) => {
  const createdCard = await cardModel.createNew(data)
  const getNewCard = await cardModel.findOneById(createdCard.insertedId)
  if (getNewCard) {
    await columnModel.pushCardOrderIds(getNewCard)
  }
  return getNewCard
}
const update = async (id, data, cardCoverFile) => {
  const validData = {
    ...data,
    updateAt: Date.now()
  }
  if (cardCoverFile) {
    const updateResult = await CloudinaryProvider.uploadStream(
      cardCoverFile.buffer,
      'card-covers'
    )
    return await cardModel.update(id, {
      cover: updateResult.secure_url
    })
  } else return await cardModel.update(id, validData)
}

export const cardService = {
  createNew,
  update
}
