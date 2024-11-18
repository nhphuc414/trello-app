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

export const invitationController = { createNewBoardInvitation, getInvitations }
