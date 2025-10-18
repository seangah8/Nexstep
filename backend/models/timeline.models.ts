import { ObjectId } from "mongodb"

export interface TimelineModel {
    _id: string | ObjectId
    steps: StepModel[]
    ownerId: string | ObjectId
    createdAt: number
}

export interface StepModel {
    id: string
    parentId: string | null
    title: string
    description: string
    image: string
    end: number
}

export interface AnswerModel{
  label: string
  value: string
  meaning: string
}

interface GoalInfoModel {
  title: string
  description: string
  days_to_complete: number
}


export interface InfoForOpenAIModel {
  goal: GoalInfoModel
  answers: Record<string, AnswerModel>
}

export interface OpenAIPathsModel {
  title: string
  description: string
  icon: string
  value: {title: string, description: string, days: number}[]
}

export interface TimelineCredentialsModel {
    title: string
    description: string
    imageUrl: string | null
    daysAmount: number
}