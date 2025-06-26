import { Request, Response, NextFunction } from 'express'
import { asyncLocalStorage } from '../services/als.service'
import { AlsStoreModel } from '../models/alsStore.model'

export function requireAuth(req: Request, res: Response, next: NextFunction): void | Response {
  const alsStore = asyncLocalStorage.getStore() as AlsStoreModel
  if (!alsStore?.loggedinUser) return res.status(401).send('Login first!')
  next()
}
