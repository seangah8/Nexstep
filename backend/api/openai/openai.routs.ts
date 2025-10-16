import express, { Router } from 'express'
import { log } from '../../middlewares/log.middleware'
import { openAITest, generatePaths} from './openai.controller'

const router : Router = express.Router()

router.get('/test', openAITest)
router.post('/paths', log, generatePaths)

export const openAIRoutes : Router = router