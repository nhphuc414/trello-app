import express from 'express'
import { columnController } from '~/controllers/columnController'
import asyncMiddleware from '~/middlewares/asyncMiddleware'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { columnValidation } from '~/validations/columnValidation'
const Router = express.Router()

Router.route('/').post(
  authMiddleware.isAuthorized,
  columnValidation.createNew,
  asyncMiddleware(columnController.createNew)
)
Router.route('/:id')
  .put(
    authMiddleware.isAuthorized,
    columnValidation.update,
    asyncMiddleware(columnController.update)
  )
  .delete(
    authMiddleware.isAuthorized,
    columnValidation.deleteItem,
    columnController.deleteItem
  )
export const columnRoute = Router
