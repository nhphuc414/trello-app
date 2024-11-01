import express from 'express'
import { userController } from '~/controllers/userController'
import asyncMiddleware from '~/middlewares/asyncMiddleware'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { userValidation } from '~/validations/userValidation'
const Router = express.Router()

Router.route('/register').post(
  userValidation.createNew,
  asyncMiddleware(userController.createNew)
)
Router.route('/verify').put(
  userValidation.verifyAccount,
  asyncMiddleware(userController.verifyAccount)
)
Router.route('/login').post(
  userValidation.login,
  asyncMiddleware(userController.login)
)
Router.route('/logout').delete(asyncMiddleware(userController.logout))

Router.route('/refresh_token').put(asyncMiddleware(userController.refreshToken))
Router.route('/update').put(
  authMiddleware.isAuthorized,
  multerUploadMiddleware.upload.single('avatar'),
  userValidation.updateUser,
  asyncMiddleware(userController.updateUser)
)
export const userRoute = Router
