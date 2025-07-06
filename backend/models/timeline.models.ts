import { ObjectId } from "mongodb"

export interface TimelineModel {
    _id: string | ObjectId
    steps: StepModel[]
    ownerId: string | ObjectId
}

export interface StepModel {
    id: string
    parentId: string | null
    title: string
    description: string
    image: string
    end: number
}