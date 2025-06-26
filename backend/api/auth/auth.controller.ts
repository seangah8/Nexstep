import { Request, Response } from 'express'
import { authService } from './auth.service'
import { loggerService } from '../../services/logger.service'
import { UserModel, CredentialsModel } from '../../models/user.model'

export const authController = {
    login,
    signup,
    logout
}


async function login(req: Request<{}, {}, CredentialsModel>,res: Response): Promise<void> {
  const credentials = req.body
  try {
    const user = await authService.login(credentials)
    loggerService.info('User login:', user)
    const loginToken : string = authService.pushLoginToken(user)
    res.cookie('loginToken', loginToken, { sameSite: 'none', secure: true })
    res.json(user)

  } catch (err) {
    loggerService.error('Failed to login: ' + (err as Error).message)
    res.status(401).send({ err: 'Failed to login' })
  }
}

async function signup(req: Request<{}, {}, CredentialsModel>, res: Response): Promise<void> {
  try {
    const credentials = req.body
    let user = await authService.signup(credentials)
    loggerService.debug(`auth.route - new account created: ${JSON.stringify(user)}`)
    user = await authService.login(credentials)
    loggerService.info('User signup:', user)
    const loginToken : string = authService.pushLoginToken(user)
    res.cookie('loginToken', loginToken, { sameSite: 'none', secure: true })
    res.json(user)

  } catch (err) {
    loggerService.error('Failed to signup: ' + (err as Error).message)
    res.status(400).send({ err: 'Failed to signup' })
  }
}

async function logout(req: Request, res: Response): Promise<void> {
  try {
    res.clearCookie('loginToken')
    res.send({ msg: 'Logged out successfully' })
  } catch (err) {
    res.status(400).send({ err: 'Failed to logout' })
  }
}
