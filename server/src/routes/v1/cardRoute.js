import express from 'express'
import { cardController } from '~/controllers/cardController'
import asyncMiddleware from '~/middlewares/asyncMiddleware'
import { cardValidation } from '~/validations/cardValidation'
const Router = express.Router()

Router.route('/').post(
  cardValidation.createNew,
  asyncMiddleware(cardController.createNew)
)
Router.route('/:id')
  .put(cardValidation.update, asyncMiddleware(cardController.update))
export const cardRoute = Router
