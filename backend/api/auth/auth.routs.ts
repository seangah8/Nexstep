import express, { Router } from 'express'
import { authController } from './auth.controller'
import { log } from '../../middlewares/log.middleware'

const router : Router = express.Router()

router.post('/login', log, authController.login)
router.post('/signup', log, authController.signup)
router.post('/logout', log, authController.logout)

export const authRoutes : Router = router