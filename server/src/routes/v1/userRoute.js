import express from 'express'
import { userController } from '~/controllers/userController'
import asyncMiddleware from '~/middlewares/asyncMiddleware'
import { userValidation } from '~/validations/userValidation'
const Router = express.Router()

Router.route('/register').post(
  userValidation.createNew,
  asyncMiddleware(userController.createNew)
)
export const userRoute = Router
