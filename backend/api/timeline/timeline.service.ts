import { OptionalId } from 'mongodb'
import { loggerService } from "../../services/logger.service"
import { dbService } from '../../services/db.service'
import { ObjectId } from 'mongodb'
import { TimelineModel } from '../../models/timeline.models'

export const timelineService = {
  query,
  getByUserId,
  remove,
  update,
  add,
}

async function query(): Promise<TimelineModel[]> {
  try {
    const collection = await dbService.getCollection<TimelineModel>('timeline')
    let timelines = await collection.find().toArray()
    timelines = timelines.map(tml=>({...tml, _id: tml._id.toString()}))
    return timelines

  } catch (err) {
    loggerService.error('cannot find timelines', err)
    throw err
  }
}


async function getByUserId(userId: string): Promise<TimelineModel | null> {
  try {
    const criteria = { ownerId: new ObjectId(userId) }
    const collection = await dbService.getCollection<TimelineModel>('timeline')
    const timeline = await collection.findOne(criteria)
    if (!timeline) throw new Error('timeline not found')
    timeline._id = timeline._id.toString()
    return timeline

  } catch (err) {
    loggerService.error(`while finding timeline by user: ${userId}`, err)
    return null
  }
}

async function remove(userId: string): Promise<void> {
  try {
    const criteria = { ownerId: new ObjectId(userId) }
    const collection = await dbService.getCollection<TimelineModel>('timeline')
    await collection.deleteOne(criteria)

  } catch (err) {
    loggerService.error(`cannot remove timeline of user ${userId}`, err)
    throw err
  }
}

async function update(timeline: TimelineModel): Promise<TimelineModel> {
  try {
    const timelineToSave = {
      ...timeline,
      _id: new ObjectId(timeline._id),
      ownerId: new ObjectId(timeline.ownerId),
    }
    const collection = await dbService.getCollection<TimelineModel>('timeline')
    await collection.updateOne({ _id: timelineToSave._id }, { $set: timelineToSave })
    const updatedTimeline : TimelineModel = 
      {...timelineToSave, _id: timelineToSave._id.toString()}
    return updatedTimeline

  } catch (err) {
    loggerService.error(`cannot update timeline ${timeline._id}`, err)
    throw err
  }
}

async function add(timelineToAdd: Omit<TimelineModel, '_id'>): Promise<TimelineModel> {
  try {
    const collection = await dbService.getCollection<OptionalId<TimelineModel>>('timeline')
    const insertedTimeline = await collection.insertOne(
      {...timelineToAdd, ownerId: new ObjectId(timelineToAdd.ownerId)})
    const addedTimeline: TimelineModel = {...timelineToAdd, _id: insertedTimeline.insertedId.toString()}
    return addedTimeline

  } catch (err) {
    loggerService.error('cannot add timeline', err)
    throw err
  }
}


