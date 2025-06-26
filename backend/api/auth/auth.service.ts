import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service'
import { loggerService } from '../../services/logger.service'
import { UserModel, UserWithPasswordModel, CredentialsModel } from '../../models/user.model'

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

export const authService = {
    pushLoginToken,
    validateToken,
    login,
    signup,
}

function pushLoginToken(user: UserModel): string {
  const str = JSON.stringify(user)
  const encryptedStr = cryptr.encrypt(str)
  return encryptedStr
}

function validateToken(token: string): UserModel | null {
  try {
    const json = cryptr.decrypt(token)
    const loggedinUser: UserModel = JSON.parse(json)
    return loggedinUser

  } catch (err) {
    console.error('Invalid login token')
    return null
  }
}

async function login(credentials : CredentialsModel): Promise<UserModel> {
  const userWithPassword = await userService.getByUsername(credentials.username)
  if (!userWithPassword) throw new Error('Unknown username')
  const match = await bcrypt.compare(credentials.password, userWithPassword.password)
  if (!match) throw new Error('Invalid username or password')
  const {password, ...rest} = userWithPassword
  const user : UserModel = rest
  return user
}

async function signup(credentials: CredentialsModel): Promise<UserModel> {

  loggerService.debug(`auth.service - signup with username: ${credentials.username}`)
  if (!credentials.username || !credentials.password) throw new Error('Missing required signup information')

  const userExist : UserWithPasswordModel | null = 
    await userService.getByUsername(credentials.username)
  if (userExist) throw new Error('Username already taken')

  const saltRounds = 10
  const hash = await bcrypt.hash(credentials.password, saltRounds)

  // creating new user here
  const newUser : Omit<UserWithPasswordModel,'_id'> = {
    username : credentials.username,
    password: hash,
  }

  return userService.add(newUser)
}
