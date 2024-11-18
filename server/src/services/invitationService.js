import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { invitationModel } from '~/models/invitationModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { pickUser } from '~/utils/formatters'

const createNewBoardInvitation = async (reqBody, inviterId) => {
  const inviter = await userModel.findOneById(inviterId)
  const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
  const board = await boardModel.findOneById(reqBody.boardId)
  if (!invitee || !inviter || !board) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Inviter, Invitee or Board not found!'
    )
  }
  const newInvitationData = {
    inviterId,
    inviteeId: invitee._id.toString(),
    type: INVITATION_TYPES.BOARD_INVITATION,
    boardInvitation: {
      boardId: board._id.toString(),
      status: BOARD_INVITATION_STATUS.PENDING
    }
  }
  const createdInvitation = await invitationModel.createNewBoardInvitation(
    newInvitationData
  )
  const getInvitation = await invitationModel.findOneById(
    createdInvitation.insertedId.toString()
  )
  const resInvitation = {
    ...getInvitation,
    board,
    inviter: pickUser(inviter),
    invitee: pickUser(invitee)
  }
  return resInvitation
}
const getInvitations = async (userId) => {
  const getInvitations = await invitationModel.findByUser(userId)
  const resInvitations = getInvitations.map((item) => {
    return {
      ...item,
      inviter: item.inviter[0] || {},
      invitee: item.invitee[0] || {},
      board: item.board[0] || {}
    }
  })
  return resInvitations
}
export const invitationService = { createNewBoardInvitation, getInvitations }
