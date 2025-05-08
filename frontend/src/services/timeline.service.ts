import { MainStepModel, StepModel, editModalModel } from "../models/timeline.models";


export const timelineService = {
  getStepsDatabase,
  getTimelineUISettings,
  findParentStart,
  changeCurrantAndNextStepsEnd,
  changeAllStepsEnd,
  DayToStepLocation,
  DayToTodayLocation,
  sortByEnd,
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
  svgCenter: {x: 300, y: 300},
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


function changeCurrantAndNextStepsEnd(
    editModal : editModalModel,
    newSteps: StepModel[],
    changedStep: StepModel,
) : StepModel[]{

  const isTodayInside = editModal.start < editModal.today 
    && editModal.today < editModal.step.end

  let allSteps = [...newSteps]

  //change step's children
  allSteps = _changeChildrenAndParentsEnd(
    allSteps, 
    changedStep, 
    editModal.start,
    editModal.step.end,
    editModal.start, // start not change
    changedStep.end,
    editModal.today,
    isTodayInside
  )

  //change next step's children as well
  if(editModal.nextStep){
    allSteps = _changeChildrenAndParentsEnd(
        allSteps, 
        editModal.nextStep, 
        editModal.step.end,
        editModal.nextStep.end,
        changedStep.end,
        editModal.nextStep.end, // end not change
        editModal.today,
        false // not possible
    )
  } 

  return allSteps
}



function changeAllStepsEnd(
  editModal: editModalModel,
  newSteps: StepModel[],
  changedStep: StepModel
): StepModel[] {
  
  let allSteps = structuredClone(newSteps)

  // for all siblings

  const siblings = sortByEnd(
    allSteps.filter(step => step.parentId === editModal.step.parentId)
  )

  const parent = allSteps.find(step => step.id === editModal.step.parentId)
  const parentStart = parent
    ? findParentStart(allSteps, parent, editModal.createTime)
    : editModal.createTime
  const parentEnd = parent
    ? parent.end
    : siblings[siblings.length - 1]?.end ?? editModal.createTime

  const isTodayInsideParent =
    parentStart < editModal.today &&
    (parent ? editModal.today < parent.end : true)

  const beforeChangedStepRatio = isTodayInsideParent
    ? (changedStep.end - editModal.today)/ (editModal.step.end - editModal.today)
    : (changedStep.end - parentStart)/(editModal.step.end - parentStart)

  const afterChangedStepRatio = 
    (parentEnd - changedStep.end)/(parentEnd - editModal.step.end)

  let postStart = parentStart

  // for each sibling

  for (let i = 0; i < siblings.length; i++) {
    const step = siblings[i]
    const prevStep = siblings[i - 1]

    const isChangedStep = step.id === changedStep.id
    const isNextStep = step.id === editModal.nextStep?.id

    const preStart = isNextStep
      ? editModal.step.end
      : i === 0
      ? parentStart
      : prevStep.end

    const preEnd = isChangedStep ? editModal.step.end : step.end

    const refPoint = isTodayInsideParent ? editModal.today : parentStart

    const postEnd = isChangedStep
      ? changedStep.end
      : step.end <= editModal.step.end
      ? Math.floor(refPoint + (step.end - refPoint) * beforeChangedStepRatio)
      : Math.floor(parentEnd - (parentEnd - step.end) * afterChangedStepRatio)

    const isTodayInside =
      isTodayInsideParent && preStart < editModal.today && editModal.today < step.end

    // Update end of current step if needed
    if (step.end > editModal.today) {
      allSteps = allSteps.map(s =>
        s.id === step.id ? { ...s, end: postEnd } : s
      )
    }
    

    // Recursively update children & parents
    allSteps = _changeChildrenAndParentsEnd(
      allSteps,
      step,
      preStart,
      preEnd,
      postStart,
      postEnd,
      editModal.today,
      isTodayInside
    )

    postStart = postEnd
  }

  return allSteps
}


function DayToStepLocation( step : StepModel,
  svgCenter: {x: number, y: number},
  totalDays: number,
  spaceDeg: number,
  radius: number,
  prevEnd: number,
  accumulated: number
){
  const angleRange = 360 - spaceDeg
  const stepDays = step.end - prevEnd
  const stepAngle = (stepDays / totalDays) * angleRange
  const startAngle = spaceDeg / 2 + (accumulated / totalDays) * angleRange
  const endAngle = startAngle + stepAngle
  accumulated += stepDays

  const angleRad = (endAngle - 90) * (Math.PI / 180)
  const stepCircleX = svgCenter.x + radius * Math.cos(angleRad)
  const stepCircleY = svgCenter.y + radius * Math.sin(angleRad)

  return {angleRange: {start: startAngle, end: endAngle}, 
    circleLocation: {x: stepCircleX, y: stepCircleY}}
  
}

function DayToTodayLocation( 
  svgCenter: {x: number, y: number},
  mainStep: MainStepModel,
  spaceDeg: number,
  radius: number,
  today: number
){
  const totalDays = mainStep.end - mainStep.start
  const angleRange = 360 - spaceDeg
  const daysFromStart = today - mainStep.start
  const todayAngle = spaceDeg / 2 + (daysFromStart / totalDays) * angleRange

  const todayRad = (todayAngle - 90) * (Math.PI / 180)
  const todayX = svgCenter.x + radius * Math.cos(todayRad)
  const todayY = svgCenter.y + radius * Math.sin(todayRad)

  return {x: todayX, y: todayY}
  
}

function sortByEnd(arr : StepModel[]) {
  return [...arr].sort((a, b) => {
    if (a.end < b.end) return -1
    if (a.end > b.end) return 1
    return 0;
  })
}








// when changing steps end youll have to change its children and 
// event mabye parents end to make sense to your timeline
function _changeChildrenAndParentsEnd(
  allSteps: StepModel[],
  changedStep: StepModel,
  preStart: number,
  preEnd: number,
  postStart: number,
  postEnd: number,
  today: number,
  isTodayInside: boolean

): StepModel[] {

  const updatedSteps = allSteps.map(step => ({ ...step })) // deep copy

  // update all childrens end under the step you changed

  function updateChildrenEnd(parent: StepModel) : void {
    const children = updatedSteps.filter(step => step.parentId === parent.id)
  
    for (const child of children) {
      updateChildrenEnd(child)
      if (child.end > today) {
        child.end = 
        isTodayInside ? 
        Math.floor(
          today + (postEnd - postStart - (today-preStart)) * ((child.end - preStart - (today-preStart)) / (preEnd - preStart - (today-preStart))))
        :
        Math.floor(
          postStart + (postEnd - postStart) * ((child.end - preStart) / (preEnd - preStart)))
      }
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
  updateChildrenEnd(changedStep)
  // updateLastParents(changedStep)

  return updatedSteps
}








     