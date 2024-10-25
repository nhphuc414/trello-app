import express from 'express'
import { cardController } from '~/controllers/cardController'
import asyncMiddleware from '~/middlewares/asyncMiddleware'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { cardValidation } from '~/validations/cardValidation'
const Router = express.Router()

Router.route('/').post(
  authMiddleware.isAuthorized,
  cardValidation.createNew,
  asyncMiddleware(cardController.createNew)
)
Router.route('/:id').put(
  authMiddleware.isAuthorized,
  cardValidation.update,
  asyncMiddleware(cardController.update)
)
export const cardRoute = Router
