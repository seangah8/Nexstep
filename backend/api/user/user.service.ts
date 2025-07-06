import { OptionalId } from 'mongodb'
import { loggerService } from "../../services/logger.service"
import { dbService } from '../../services/db.service'
import { ObjectId } from 'mongodb'
import { UserModel, UserWithPasswordModel } from '../../models/user.models'

export const userService = {
  query,
  getById,
  remove,
  getByUsername,
  update,
  add,
}

async function query(): Promise<UserModel[]> {
  try {
    const collection = await dbService.getCollection<UserWithPasswordModel>('user')
    const usersWithPassword = await collection.find().toArray()
    const users: UserModel[] = usersWithPassword.map(userwp => {
      const { password, ...rest } = userwp
      const user: UserModel = {...rest, _id: userwp._id.toString()}
      return user
    })
    return users

  } catch (err) {
    loggerService.error('cannot find users', err)
    throw err
  }
}

// returns without password
async function getById(userId: string): Promise<UserModel | null> {
  try {
    const criteria = { _id: new ObjectId(userId) }
    const collection = await dbService.getCollection<UserWithPasswordModel>('user')
    const userWithPassword = await collection.findOne(criteria)
    if (!userWithPassword) throw new Error('User not found')
    const { password, ...rest } = userWithPassword
    const user : UserModel = rest
    user._id = user._id.toString()
    return user

  } catch (err) {
    loggerService.error(`while finding user by id: ${userId}`, err)
    return null
  }
}

// return with password!
async function getByUsername(username: string): Promise<UserWithPasswordModel | null> {
  try {
    const collection = await dbService.getCollection<UserWithPasswordModel>('user')
    const userWithPassword = await collection.findOne({ username })
    if (!userWithPassword) throw new Error('User not found')
    const user : UserWithPasswordModel = {...userWithPassword,
      _id: userWithPassword._id.toString()}
    return user

  } catch (err) {
    loggerService.error(`while finding user by username: ${username}`, err)
    return null
  }
}

async function remove(userId: string): Promise<void> {
  try {
    const criteria = { _id: new ObjectId(userId) }
    const collection = await dbService.getCollection<UserWithPasswordModel>('user')
    await collection.deleteOne(criteria)

  } catch (err) {
    loggerService.error(`cannot remove user ${userId}`, err)
    throw err
  }
}

async function update(user: UserModel): Promise<UserModel> {
  try {
    const userToSave = {
      ...user,
      _id: new ObjectId(user._id),
    }
    const collection = await dbService.getCollection<UserWithPasswordModel>('user')
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
    const updatedUser : UserModel = {...userToSave, _id: userToSave._id.toString()}
    return updatedUser

  } catch (err) {
    loggerService.error(`cannot update user ${user._id}`, err)
    throw err
  }
}

async function add(userToAdd: Omit<UserWithPasswordModel, '_id'>): Promise<UserModel> {
  try {
    const collection = await dbService.getCollection<OptionalId<UserWithPasswordModel>>('user')
    const insertedUser = await collection.insertOne(userToAdd)
    const { password, ...rest } = userToAdd
    const user: UserModel = {...rest, _id: insertedUser.insertedId.toString()}
    return user

  } catch (err) {
    loggerService.error('cannot add user', err)
    throw err
  }
}


