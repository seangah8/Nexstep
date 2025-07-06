import { Request, Response } from 'express'
import { loggerService } from '../../services/logger.service'
import { userService } from './user.service'
import { authController } from '../auth/auth.controller'
import { CredentialsModel, UserModel } from '../../models/user.models'

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await userService.query()
    res.send(users)
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't get users`)
  }
}

export async function getUser(req: Request, res: Response): Promise<void> {
  const { userId } = req.params
  try {
    const user = await userService.getById(userId)
    if(!user) throw new Error('user not found!')
    res.send(user)
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't get user`)
  }
}

export async function addUser(req: Request<{}, {}, CredentialsModel>, res: Response): Promise<void> {
  try {
    await authController.signup(req, res)
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't save user`)
  }
}

export async function updateUser(req: Request<{}, {}, UserModel>, res: Response): Promise<void> {
  const userToSave = req.body
  try {
    const savedUser = await userService.update(userToSave)
    res.send(savedUser)
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't save user`)
  }
}

export async function removeUser(req: Request, res: Response): Promise<void> {
  const { userId } = req.params
  try {
    await userService.remove(userId)
    res.send('User Deleted')
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't remove user`)
  }
}
