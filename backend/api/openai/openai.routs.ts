import express, { Router } from 'express'
import { log } from '../../middlewares/log.middleware'
import { openAITest, generatePaths, generateImageTest, generateStepsImages} from './openai.controller'

const router : Router = express.Router()

router.get('/test', openAITest)
router.get('/test-image', generateImageTest)
router.post('/paths', log, generatePaths)
router.post('/steps-images', log, generateStepsImages)

export const openAIRoutes : Router = router