import { Request, Response } from 'express'
import { loggerService } from '../../services/logger.service'
import { timelineService } from './timeline.service'
import { TimelineCredentialsModel, TimelineModel } from '../../models/timeline.models'
import { asyncLocalStorage } from '../../services/als.service'
import { AlsStoreModel } from '../../models/alsStore.models'

export async function getTimelines(req: Request, res: Response): Promise<void> {
  try {
    const timelines = await timelineService.query()
    res.send(timelines)
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't get timelines`)
  }
}

export async function getTimelineByUserId(req: Request, res: Response): Promise<void> {
  const { userId } = req.params
  try {
    const timeline = await timelineService.getByUserId(userId)
    if(!timeline) throw new Error('timeline not found!')
    res.send(timeline)
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't get timeline`)
  }
}

export async function addTimeline(req: Request<{}, {}, TimelineCredentialsModel>, res: Response): Promise<void> {
  const timelineCredentials = req.body
  const alsStore = asyncLocalStorage.getStore() as AlsStoreModel
  const loggedinUserId = alsStore.loggedinUser?._id
  try {
    if(!loggedinUserId) throw new Error('no user logged in')
    const todaysDate = new Date()
    const today = Math.floor(todaysDate.getTime() / (1000 * 60 * 60 * 24))
    const defultStepImage = 'https://images.icon-icons.com/1558/PNG/512/353412-flag_107497.png'
    const newTimeline : Omit<TimelineModel,'_id'> = {
      steps: [
        {
          id: 'userGoalId', 
          title: timelineCredentials.title, 
          parentId: null, 
          end: today + timelineCredentials.daysAmount, 
          description: timelineCredentials.description, 
          image: timelineCredentials.imageUrl ?? defultStepImage
        }
      ],
      ownerId: loggedinUserId,
      createdAt: today
    }

    const timeline = await timelineService.add(newTimeline)
    res.send(timeline)
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't save timeline`)
  }
}

export async function updateTimeline(req: Request<{}, {}, TimelineModel>, res: Response): Promise<void> {
  const timelineToSave = req.body
  try {
    const savedTimeline = await timelineService.update(timelineToSave)
    res.send(savedTimeline)
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't save timeline`)
  }
}

export async function removeTimeline(req: Request, res: Response): Promise<void> {
  const alsStore = asyncLocalStorage.getStore() as AlsStoreModel
  const loggedinUserId = alsStore.loggedinUser?._id
  try {
    if(!loggedinUserId) throw new Error('no user logged in')
    await timelineService.remove(loggedinUserId)
    res.send('Timeline Deleted')
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't remove timeline`)
  }
}
