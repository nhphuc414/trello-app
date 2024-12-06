import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const createNew = async (data) => {
  const createdCard = await cardModel.createNew(data)
  const getNewCard = await cardModel.findOneById(createdCard.insertedId)
  if (getNewCard) {
    await columnModel.pushCardOrderIds(getNewCard)
  }
  return getNewCard
}
const update = async (id, data, cardCoverFile, userInfo) => {
  const validData = {
    ...data,
    updateAt: Date.now()
  }
  let updatedCard = {}
  if (cardCoverFile) {
    const updateResult = await CloudinaryProvider.uploadStream(
      cardCoverFile.buffer,
      'card-covers'
    )
    updatedCard = await cardModel.update(id, {
      cover: updateResult.secure_url
    })
  } else if (validData.commentToAdd) {
    const commentData = {
      ...validData.commentToAdd,
      commentedAt: Date.now(),
      userId: userInfo._id,
      userEmail: userInfo.email
    }
    updatedCard = await cardModel.unshiftNewComment(id, commentData)
  } else if (validData.incomingMemberInfo) {
    updatedCard = await cardModel.updateMembers(
      id,
      validData.incomingMemberInfo
    )
  } else {
    updatedCard = await cardModel.update(id, validData)
  }
  return updatedCard
}

export const cardService = {
  createNew,
  update
}
