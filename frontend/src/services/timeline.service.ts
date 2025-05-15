import { MainStepModel, StepModel } from "../models/timeline.models";


export const timelineService = {
  getStepsDatabase,
  getTimelineUISettings,
  findParentStart,
  changeCurrantAndNextStepsEnd,
  changeAllStepsEnd,
  dayToStepLocation,
  dayToLocation,
  locationToDay,
  sortByEnd,
  findStepMaxEnd,
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
    preStart: number,
    preEnd: number,
    today: number,
    newSteps: StepModel[],
    changedStep: StepModel,
    nextStep: StepModel | null,
) : StepModel[]{

  const isTodayInside = preStart < today && today < preEnd

  let allSteps = [...newSteps]

  // prevent from step end to get over next parent start
  allSteps = allSteps.map(step=> {
    if (step.id === changedStep.id){
      const newChangedStep = _preventGetOverMaxEnd(allSteps, step, preEnd)
      changedStep = newChangedStep
      return newChangedStep
    }
    else return step
  })
  //change step's children
  allSteps = _changeChildrenAndParentsEnd(
    allSteps, 
    changedStep, 
    preStart,
    preEnd,
    preStart, // start not change
    changedStep.end,
    today,
    isTodayInside
  )

  //change next step's children as well
  if(nextStep){
    allSteps = _changeChildrenAndParentsEnd(
        allSteps, 
        nextStep, 
        preEnd,
        nextStep.end,
        changedStep.end,
        nextStep.end, // end not change
        today,
        false // not possible to have today inside
    )
  } 

  return allSteps
}



function changeAllStepsEnd(
    preEnd: number,
    today: number,
    newSteps: StepModel[],
    changedStep: StepModel,
    nextStep: StepModel | null,
    createTime: number
): StepModel[] {
  
  let allSteps = structuredClone(newSteps)

  // prevent from step end to get over next parent start
  allSteps = allSteps.map(step=> {
    if (step.id === changedStep.id){
      const newChangedStep = _preventGetOverMaxEnd(allSteps, step, preEnd)
      changedStep = newChangedStep
      return newChangedStep
    }
    else return step
  })


  // for all siblings

  const siblings = sortByEnd(
    allSteps.filter(step => step.parentId === changedStep.parentId)
  )

  const parent = allSteps.find(step => step.id === changedStep.parentId)
  const parentStart = parent
    ? findParentStart(allSteps, parent, createTime)
    : createTime
  const parentEnd = parent
    ? parent.end
    : siblings[siblings.length - 1]?.end ?? createTime

  const isTodayInsideParent =
    parentStart < today &&
    (parent ? today < parent.end : true)

  const beforeChangedStepRatio = isTodayInsideParent
    ? (changedStep.end - today)/ (preEnd - today)
    : (changedStep.end - parentStart)/(preEnd - parentStart)

  const afterChangedStepRatio = 
    (parentEnd - changedStep.end)/(parentEnd - preEnd)

  let postSiblingStart = parentStart

  // for each sibling

  for (let i = 0; i < siblings.length; i++) {
    const step = siblings[i]
    const prevStep = siblings[i - 1]

    const isChangedStep = step.id === changedStep.id
    const isNextStep = step.id === nextStep?.id

    const preSiblingStart = isNextStep
      ? preEnd
      : i === 0
      ? parentStart
      : prevStep.end

    const preSiblingEnd = isChangedStep ? preEnd : step.end

    const refPoint = isTodayInsideParent ? today : parentStart

    const postSiblingEnd = isChangedStep
      ? changedStep.end
      : step.end <= preEnd
      ? Math.floor(refPoint + (step.end - refPoint) * beforeChangedStepRatio)
      : Math.floor(parentEnd - (parentEnd - step.end) * afterChangedStepRatio)

    const isTodayInside =
      isTodayInsideParent && preSiblingStart < today && today < step.end

    // update end of current sibling step
    if (step.end > today) {
      allSteps = allSteps.map(s =>
        s.id === step.id ? { ...s, end: postSiblingEnd } : s
      )
    }

    // Recursively update children & parents
    allSteps = _changeChildrenAndParentsEnd(
      allSteps,
      step,
      preSiblingStart,
      preSiblingEnd,
      postSiblingStart,
      postSiblingEnd,
      today,
      isTodayInside
    )

    postSiblingStart = postSiblingEnd
  }

  return allSteps
}


function dayToStepLocation( step : StepModel,
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

function dayToLocation( 
  svgCenter: {x: number, y: number},
  mainStep: MainStepModel,
  spaceDeg: number,
  radius: number,
  day: number
){
  const totalDays = mainStep.end - mainStep.start
  const angleRange = 360 - spaceDeg
  const daysFromStart = day - mainStep.start
  const todayAngle = spaceDeg / 2 + (daysFromStart / totalDays) * angleRange

  const todayRad = (todayAngle - 90) * (Math.PI / 180)
  const todayX = svgCenter.x + radius * Math.cos(todayRad)
  const todayY = svgCenter.y + radius * Math.sin(todayRad)

  return {x: todayX, y: todayY}
  
}

function locationToDay(
  svgCenter: {x: number, y: number},
  svgLocation: {x: number, y: number},
  mainStep: {start: number, end: number},
  spaceDeg: number,
  location: {x: number, y: number}
) {

  // get angle from center to location (in degrees)
  const dx = location.x - (svgCenter.x + svgLocation.x)
  const dy = location.y - (svgCenter.y + svgLocation.y)
  let angle = Math.atan2(dy, dx) * (180 / Math.PI)
  angle = (angle + 450) % 360 // Normalize to [0, 360), rotating so 0 is "top" (12 o'clock)

  // clamp angle within the relevant range
  const clampedAngle = Math.max(spaceDeg / 2, Math.min(360 - spaceDeg / 2, angle))

  // convert angle to a day
  const totalDays = mainStep.end - mainStep.start
  const angleRange = 360 - spaceDeg
  const relativeAngle = clampedAngle - spaceDeg / 2
  const progress = relativeAngle / angleRange
  const day = mainStep.start + progress * totalDays

  return Math.floor(day)
}


function sortByEnd(arr : StepModel[]) {
  return [...arr].sort((a, b) => {
    if (a.end < b.end) return -1
    if (a.end > b.end) return 1
    return 0;
  })
}


function findStepMaxEnd(allSteps : StepModel[], step: StepModel) : number{
  const siblings = allSteps.filter(s=> s.parentId === step.parentId)

  return siblings.reduce((acc, sibling)=>{
    if(sibling.end > step.end && sibling.end < acc)
      return sibling.end
    return acc

  },Number.MAX_SAFE_INTEGER)
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
      const maxEnd = findStepMaxEnd(allSteps, parent)
      parent.end = (postEnd > (maxEnd - 1)) ? maxEnd - 1 : postEnd
      updateParents(parent)
    }
  }
  
  updateParents(changedStep)
  updateChildrenEnd(changedStep)
  // updateLastParents(changedStep)

  return updatedSteps
}


function _preventGetOverMaxEnd(allSteps :StepModel[], step: StepModel, preEnd: number) : StepModel{

  const parent = allSteps.find(s=>s.id === step.parentId)

  if(preEnd === parent?.end){
      const maxEnd = timelineService.findStepMaxEnd(allSteps, parent)
      return {...step, end: Math.min(maxEnd-1, step.end)}
  }

  else return step
}









     