import { StepModel } from "../models/timeline.models";


export const timelineService = {
  getStepsDatabase,
  getTimelineUISettings,
  findParentStart,
  changeChildrenAndParentsEnd
}

const stepsDatabase =     [
  { id: 'idUserGoal', title:'Users Goal', parentId: null, end: 350},
  {id: 'idS1', parentId: 'idUserGoal', title: 'S1', end: 150},
  {id: 'idS1.S1' ,parentId: 'idS1', title: 'S1.S1', end: 105},
  {id: 'idS1.S2' ,parentId: 'idS1', title: 'S1.S2', end: 115},
  {id: 'idS1.N2' ,parentId: 'idS1', title: 'S1', end: 150},
  {id: 'idS2' ,parentId: 'idUserGoal', title: 'S2', end: 180},
  {id: 'idS3' ,parentId: 'idUserGoal', title: 'S3', end: 240},
  {id: 'idS4' ,parentId: 'idUserGoal', title: 'S4', end: 330},
  {id: 'idG' ,parentId: 'idUserGoal', title: 'G', end: 350},
  {id: 'idG.F' ,parentId: 'idG', title: 'G.S1', end: 335},
  {id: 'idG.G' ,parentId: 'idG', title: 'G', end: 350}
]

const timelineUISettings = {
  svgSize: 600,
  pathCenter: {x: 300, y: 300},
  radius: 250,
  spaceDeg: 60,
  strokeWidth: 30,
  circlesSize: 35
}

function getStepsDatabase(){
  return stepsDatabase
}

function getTimelineUISettings(){
  return timelineUISettings
}


// returns parent start for the main step when zooming out
function findParentStart(allSteps: StepModel[], parent: StepModel, createTime: number): number {
  const siblings = allSteps.filter(step => step.parentId === parent.parentId)
  const latestSiblingBefore = siblings
    .filter(step => step.end < parent.end)
    .reduce((maxEnd, step) => Math.max(maxEnd, step.end), 0)

  if (latestSiblingBefore !== 0) return latestSiblingBefore

  const grandparent = allSteps.find(step => step.id === parent.parentId)
  if (grandparent && grandparent.id !== parent.id) {
    return findParentStart(allSteps, grandparent, createTime)
  }

  return createTime
}


// when changing steps end youll have to change its children and 
// event mabye parents end to make sense to your timeline
function changeChildrenAndParentsEnd(
  allSteps: StepModel[],
  changedStep: StepModel,
  preStart: number,
  preEnd: number,
  postStart: number,
  postEnd: number
): StepModel[] {

  const updatedSteps = allSteps.map(step => ({ ...step })) // deep copy

  // update all childrens end under the step you changed
  function updateChildren(parent: StepModel) : void {
    const children = updatedSteps.filter(step => step.parentId === parent.id)
  
    for (const child of children) {
      updateChildren(child)
      child.end = Math.floor(
        postStart + ((postEnd - postStart) * (child.end - preStart)) / (preEnd - preStart)
      )
    }
  }

  // if the step was the last one make sure to update its end to obove parents
  function updateParents(changedStep : StepModel) : void{
    const parent = updatedSteps.find(step=>step.id === changedStep.parentId)
    if(parent && preEnd === parent.end){
      parent.end = postEnd
      updateParents(parent)
    }
  }
  
  updateParents(changedStep)
  updateChildren(changedStep)
  // updateLastParents(changedStep)

  return updatedSteps
}




     