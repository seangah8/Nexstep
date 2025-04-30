
export interface StepModel {
    id: string
    parentId: string | null
    title: string
    end: number
  }
  
export interface MainStepModel extends  StepModel{
  start: number
}

export interface editModalModel{
  step: StepModel
  start: number
  nextStep: StepModel | null
}