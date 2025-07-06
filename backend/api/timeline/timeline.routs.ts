import express, { Router } from 'express'
import { addTimeline, getTimeline, getTimelines, removeTimeline, updateTimeline } from './timeline.controller';
import { log } from '../../middlewares/log.middleware'
import { requireAuth } from '../../middlewares/require-auth.middleware';

const router : Router = express.Router()

router.get('/', getTimelines)
router.get('/:userId', log, getTimeline)
router.delete('/', log, requireAuth, removeTimeline)
router.post('/', log, requireAuth, addTimeline)
router.put('/', log, requireAuth, updateTimeline)

export const timelineRoutes : Router = router


