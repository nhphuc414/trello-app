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
  const boardOwnerMemberIds = [...board.ownerIds, ...board.memberIds].toString()
  if (!boardOwnerMemberIds.includes(inviter._id.toString())) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      // eslint-disable-next-line quotes
      "You don't have permission to invite a user to this board!"
    )
  }
  if (inviter._id.toString() === invitee._id.toString()) {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      'Oops! You are inviting yourself!'
    )
  }
  if (boardOwnerMemberIds.includes(invitee._id.toString())) {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      'The user of this email has already joined this board!'
    )
  }
  const existInvitation = await invitationModel.findByInviteeAndBoard(
    invitee._id,
    board._id
  )
  if (existInvitation) {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      'Oops! This email has been invited!'
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
const updateBoardInvitation = async (userId, invitationId, status) => {
  const getInvitation = await invitationModel.findOneById(invitationId)
  if (!getInvitation)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found!')
  const getBoard = await boardModel.findOneById(
    getInvitation.boardInvitation.boardId
  )
  if (!getBoard) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
  const updateData = {
    boardInvitation: {
      ...getInvitation.boardInvitation,
      status: status
    }
  }
  const updatedInvitation = await invitationModel.update(
    invitationId,
    updateData
  )
  if (
    updatedInvitation.boardInvitation.status ===
    BOARD_INVITATION_STATUS.ACCEPTED
  ) {
    await boardModel.pushMemberIds(
      getInvitation.boardInvitation.boardId,
      userId
    )
  }
  return updatedInvitation
}
export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation
}
