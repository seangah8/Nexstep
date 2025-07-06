import { Request, Response, NextFunction } from 'express'
import { asyncLocalStorage } from '../services/als.service'
import { AlsStoreModel } from '../models/alsStore.models'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const alsStore = asyncLocalStorage.getStore() as AlsStoreModel
  if (!alsStore?.loggedinUser) {
    res.status(401).send('Login first!')
    return 
  }
  next()
}
