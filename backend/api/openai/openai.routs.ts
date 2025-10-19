import express, { Router } from 'express'
import { log } from '../../middlewares/log.middleware'
import { openAITest, generatePaths, generateImageTest} from './openai.controller'

const router : Router = express.Router()

router.get('/test', openAITest)
router.get('/test-image', generateImageTest)
router.post('/paths', log, generatePaths)

export const openAIRoutes : Router = router