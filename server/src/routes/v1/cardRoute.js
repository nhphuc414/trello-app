import express from 'express'
import { cardController } from '~/controllers/cardController'
import { cardValidation } from '~/validations/cardValidation'
const Router = express.Router()

Router.route('/').post(cardValidation.createNew, cardController.createNew)
Router.route('/:id').get(cardController.getDetails)
export const cardRoute = Router
