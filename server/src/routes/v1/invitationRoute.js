import express from 'express'
import { invitationController } from '~/controllers/invitationController'
import asyncMiddleware from '~/middlewares/asyncMiddleware'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { invitationValidation } from '~/validations/invitationValidation'

const Router = express.Router()

Router.route('/board').post(
  authMiddleware.isAuthorized,
  invitationValidation.createNewBoardInvitation,
  asyncMiddleware(invitationController.createNewBoardInvitation)
)
Router.route('/').get(
  authMiddleware.isAuthorized,
  asyncMiddleware(invitationController.getInvitations)
)
export const invitationRoute = Router
