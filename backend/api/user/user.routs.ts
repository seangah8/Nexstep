import express, { Router } from 'express'
import { addUser, getUser, getUsers, removeUser, updateUser } from './user.controller';
import { log } from '../../middlewares/log.middleware'

const router : Router = express.Router()

router.get('/', getUsers)
router.get('/:userId', log, getUser)
router.delete('/:userId', log, removeUser)
router.post('/', log, addUser)
router.put('/:userId', log, updateUser)

export const userRoutes : Router = router