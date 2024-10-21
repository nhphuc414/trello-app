import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import asyncMiddleware from '~/middlewares/asyncMiddleware'
const Router = express.Router()

Router.route('/').post(
  boardValidation.createNew,
  asyncMiddleware(boardController.createNew)
)
Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, asyncMiddleware(boardController.update))

Router.route('/supports/moving_card').put(
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
)
export const boardRoute = Router
