import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import asyncMiddleware from '~/middlewares/asyncMiddleware'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, boardController.getBoards)
  .post(
    authMiddleware.isAuthorized,
    boardValidation.createNew,
    asyncMiddleware(boardController.createNew)
  )
Router.route('/:id')
  .get(
    // authMiddleware.isAuthorized,
    asyncMiddleware(boardController.getDetails)
  )
  .put(
    authMiddleware.isAuthorized,
    boardValidation.update,
    asyncMiddleware(boardController.update)
  )

Router.route('/supports/moving_card').put(
  authMiddleware.isAuthorized,
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
)
export const boardRoute = Router
