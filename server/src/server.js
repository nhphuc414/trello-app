/* eslint-disable no-console */
import { env } from '~/config/environment'
import cors from 'cors'
import { corsOptions } from './config/cors'
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import socketIo from 'socket.io'
import http from 'http'
import { inviteUserToBoardSocket } from './sockets/inviteUserToBoardSocket'
const START_SERVER = () => {
  const app = express()
  if (env.BUILD_MODE === 'dev') {
    app.use(morgan('dev'))
  }
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  app.use(cookieParser())
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddleware)
  const server = http.createServer(app)
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    inviteUserToBoardSocket(socket)
  })
  if (env.BUILD_MODE === 'production') {
    server.listen(env.PORT, () => {
      console.log(
        `Production: Hi ${env.AUTHOR}, Back-end Server is running successfully at Port: ${env.PORT}`
      )
    })
  } else {
    // Môi trường Local Dev
    server.listen(env.LOCAL_DEV_APP_PORT, () => {
      console.log(
        `Local DEV: Hello ${env.AUTHOR}, Back-end Server is running successfully at Host: ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`
      )
    })
  }

  exitHook(() => {
    console.log('4.Disconnecting from MongoDB Cloud Atlas!')
    CLOSE_DB()
    console.log('5.Disconnected from MongoDB Cloud Atlas!')
  })
}

;(async () => {
  try {
    console.log('1. Connection to MongoDB Cloud Atlas!')
    CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()
