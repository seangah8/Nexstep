
export interface TimelineModel {
    _id: string
    steps: StepModel[]
    ownerId: string
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
  
export interface MainStepModel extends  StepModel{
  start: number
}

export interface EditModalModel{
  step: StepModel
  start: number
  nextStep: StepModel | null
  today: number
  createTime: number
}

export interface DraggingModel{
    startPoint: {x:number, y:number}, 
    druggingStep: StepModel, 
    onShift: boolean,
    prevStepsToSow: StepModel[]
}

export interface OptionModel{
  icon: string
  title: string
  description: string
  value: string | StepModel[]
}

export interface MentorQuestionModel {
  question: string
  key: string 
  label: string
  meaning: string  
  options: OptionModel[]         
  answer: string | StepModel[] | null  
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
  [key: string]: AnswerModel | GoalInfoModel
}

export interface OpenAIPathsModel {
  title: string
  description: string
  icon: string
  value: {title: string, description: string, days: number}[]
}