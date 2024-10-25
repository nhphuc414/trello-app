/* eslint-disable no-console */
import { env } from '~/config/environment'
import cors from 'cors'
import { corsOptions } from './config/cors'
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))
  app.use(express.json())
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddleware)
   // Môi trường Production
  if (env.BUILD_MODE === 'production') {
    app.listen(env.PORT, () => {
      console.log(`Production: Hi ${env.AUTHOR}, Back-end Server is running successfully at Port: ${env.PORT}`)
    })
  } else {
    // Môi trường Local Dev
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`Local DEV: Hello ${env.AUTHOR}, Back-end Server is running successfully at Host: ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`)
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
