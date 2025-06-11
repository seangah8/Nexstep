
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