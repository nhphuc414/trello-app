import express from 'express'
import { columnController } from '~/controllers/columnController'
import asyncMiddleware from '~/middlewares/asyncMiddleware'
import { columnValidation } from '~/validations/columnValidation'
const Router = express.Router()

Router.route('/').post(
  columnValidation.createNew,
  asyncMiddleware(columnController.createNew)
)
Router.route('/:id')
  .put(columnValidation.update, asyncMiddleware(columnController.update))
  .delete(columnValidation.deleteItem, columnController.deleteItem)
export const columnRoute = Router
