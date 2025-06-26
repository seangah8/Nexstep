import { Request, Response, NextFunction } from 'express'
import { loggerService } from '../services/logger.service'

export function log(req: Request, res: Response, next: NextFunction) {
  loggerService.info('Visited route', req.route?.path || req.url)
  next()
}