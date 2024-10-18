import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
const Router = express.Router()

Router.get('/status', (req, res) => {
  res
    .status(200)
    .json({ message: 'APIs V1 are ready to use.', code: StatusCodes.OK })
})

Router.use('/boards', boardRoute)
export const APIs_V1 = Router