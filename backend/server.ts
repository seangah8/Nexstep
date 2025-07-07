import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service'
import { userRoutes } from './api/user/user.routs'
import { authRoutes } from './api/auth/auth.routs'
import { timelineRoutes } from './api/timeline/timeline.routs'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware'

const app = express()

//* App Configuration
app.use(express.json())
app.use(cookieParser())

const corsOptions = {
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
  credentials: true,
}
app.use(cors(corsOptions))

//* Routes
app.use(setupAsyncLocalStorage)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/timeline', timelineRoutes)

//* Open Server
const PORT: number = Number(process.env.PORT) || 3000
app.listen(PORT, () => {
  loggerService.info('Up and running on ' + `http://localhost:${PORT}`)
})
