import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'

const createNewBoardInvitation = async (req, res) => {
  const inviterId = req.jwtDecoded._id
  const resInvitation = await invitationService.createNewBoardInvitation(
    req.body,
    inviterId
  )
  res.status(StatusCodes.CREATED).json(resInvitation)
}

const getInvitations = async (req, res) => {
  const userId = req.jwtDecoded._id
  const resInvitations = await invitationService.getInvitations(userId)
  res.status(StatusCodes.OK).json(resInvitations)
}
const updateBoardInvitation = async (req, res) => {
  const userId = req.jwtDecoded._id
  const { invitationId } = req.params
  const { status } = req.body
  const updatedInvitation = await invitationService.updateBoardInvitation(
    userId,
    invitationId,
    status
  )
  res.status(StatusCodes.OK).json(updatedInvitation)
}
export const invitationController = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation
}
