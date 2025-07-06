import { Request, Response, NextFunction } from 'express'
import { authService } from '../api/auth/auth.service'
import { asyncLocalStorage } from '../services/als.service'
import { AlsStoreModel } from '../models/alsStore.models'


export async function setupAsyncLocalStorage(req: Request, res: Response, next: NextFunction): Promise<void> {
  const storage: AlsStoreModel = {}


  asyncLocalStorage.run(storage, () => {
    const token = req.cookies?.loginToken
    if (!token) return next()

    const loggedinUser = authService.validateToken(token)
    if (loggedinUser) {
      const alsStore = asyncLocalStorage.getStore() as AlsStoreModel
      if (alsStore) alsStore.loggedinUser = loggedinUser
    }

    next()
  })
}

