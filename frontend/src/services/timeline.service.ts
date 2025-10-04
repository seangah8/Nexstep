import { TimelineModel, MainStepModel, StepModel } from "../models/timeline.models";
import { httpService } from "./http.service";

export const timelineService = {
  query,
  get,
  remove,
  add,
  update,
  getTimelineUISettings,
  getToday,
  findParentStart,
  changeChildrenAndParentsEnd,
  changeCurrantAndNextStepsEnd,
  changeAllStepsEnd,
  dayToStepLocation,
  dayToLocation,
  locationToDay,
  sortByEnd,
  findStepMaxEnd,
  deleteStep,
  findStepTotalMaxEnd,
  findRightStepToDelete,
  extractWhenCreateNewStep,
  formatDateFromEnd,
  updateParentsExceptEnd,
  updateLastChildrensExceptEnd,
  getTrianglePoints,
}

async function query(): Promise<TimelineModel[]> {
  return await httpService.get(`timeline`)
}

// get by owner id
async function get(ownerId : string) : Promise<TimelineModel> {
  return await httpService.get(`timeline/${ownerId}`)
}

async function remove() : Promise<void> {
  await httpService.delete(`timeline`)
}

async function add() : Promise<TimelineModel> {
  return await httpService.post('timeline')
}

async function update(timeline : TimelineModel) : Promise<TimelineModel> {
  return await httpService.put(`timeline`, timeline)
}

function getTimelineUISettings(){
  const timelineUISettings = {
    svgSize: 600,
    svgCenter: {x: 300, y: 300},
    radius: 250,
    spaceDeg: 60,
    strokeWidth: 30,
    circlesRadius: 40,
    circlesPadding: 6,
    fadeTimeSeconds: 0.1,
    mentorRadiusClose: 250,
    selectorsRadius: 430,
    iconsPathRadius: 260,
    iconsRadius: 25,
    chatRadiuse: 150,
  }
  return timelineUISettings
}

function getToday(){
  const todaysDate = new Date()
  return Math.floor(todaysDate.getTime() / (1000 * 60 * 60 * 24))
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

  //change step's children
  allSteps = changeChildrenAndParentsEnd(
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
    allSteps = changeChildrenAndParentsEnd(
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

  // for all siblings

  const siblings = sortByEndWithChangedStep(
    allSteps.filter(step => step.parentId === changedStep.parentId),
    changedStep,
    preEnd
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
      isTodayInsideParent && preSiblingStart < today && today < preSiblingEnd

    // update end of current sibling step
    if (step.end > today) {
      allSteps = allSteps.map(s =>
        s.id === step.id ? { ...s, end: postSiblingEnd } : s
      )
    }

    // Recursively update children & parents
    allSteps = changeChildrenAndParentsEnd(
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


function sortByEnd(arr : StepModel[]) : StepModel[] {
  return [...arr].sort((a, b) => {
    if (a.end < b.end) return -1
    if (a.end > b.end) return 1
    return 0;
  })
}

function sortByEndWithChangedStep(
  steps: StepModel[], 
  changedStep: StepModel, 
  preEnd: number,
) : StepModel[]{

  const oldSteps = steps.map(step=>
    step.id === changedStep.id ? {...step, end: preEnd} : step)
  const sortedSteps = sortByEnd(oldSteps)
  return sortedSteps.map(step=>
    step.id === changedStep.id ? {...step, end: changedStep.end} : step)
}

// this is not related to any parents limitations
function findStepMaxEnd(allSteps : StepModel[], step: StepModel) : number{
  const siblings = allSteps.filter(s=> s.parentId === step.parentId)

  return siblings.reduce((acc, sibling)=>{
    if(sibling.end > step.end && sibling.end < acc)
      return sibling.end
    return acc

  },Number.MAX_SAFE_INTEGER)
}







function changeChildrenAndParentsEnd(
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
      // in special delete case when today exists after start change
      if(preStart > today && postStart < today){
        child.end = 
          Math.floor(today + (postEnd - today) * ((child.end - preStart) / (preEnd - preStart)))
      }
      // in normal cases
      else{
        if (child.end > today || postStart > today) {
          child.end = isTodayInside 
          ? Math.floor(
            today + (postEnd - today) * ((child.end - today) / (preEnd - today)))
          : Math.floor(
            postStart + (postEnd - postStart) * ((child.end - preStart) / (preEnd - preStart)))
        }
      }
    }
  }

  // if the step was the last one make sure to update its end to obove parents
  function updateParentsEnd(changedStep : StepModel) : void{
    const parent = updatedSteps.find(step=>step.id === changedStep.parentId)
    if(parent && preEnd === parent.end){
      const maxEnd = findStepMaxEnd(allSteps, parent)
      parent.end = (postEnd > (maxEnd - 1)) ? maxEnd - 1 : postEnd
      updateParentsEnd(parent)
    }
  }
  
  updateParentsEnd(changedStep)
  updateChildrenEnd(changedStep)
  // updateLastParents(changedStep)

  return updatedSteps
}

function deleteStep(allSteps: StepModel[], step: StepModel, today: number): StepModel[] {

  // a Set is a built-in object that stores unique values — no duplicates allowed.
  // no duplicates allowed!
  // very fast - "has()" search much faster than array.includes() which is linear.
  const idsToDelete = new Set<string>()

  function collectChildrenId(id: string) {
    idsToDelete.add(id)
    allSteps.forEach(s => {
      if (s.parentId === id) {
        // if step already finished don't delete it
        // and if its step's child bring it up
        if(s.end >= today)
          collectChildrenId(s.id)
        else if(s.parentId === step.id)
            s.parentId = step.parentId 
      }
    })
  }

  collectChildrenId(step.id)

  return allSteps.filter(s => !idsToDelete.has(s.id))
}

// relate to any parents limitations
function findStepTotalMaxEnd(allSteps :StepModel[], step: StepModel) : number{

  const parent = allSteps.find(s=>s.id === step.parentId)
  if(parent){
    const maxParentEnd = findStepMaxEnd(allSteps, parent)
    // is parent last?
    return (maxParentEnd === Number.MAX_SAFE_INTEGER)
      ? findStepTotalMaxEnd(allSteps, parent)
      : maxParentEnd - 1
  }
  else return Number.MAX_SAFE_INTEGER
}

function findRightStepToDelete(allSteps: StepModel[], stepToDelete: StepModel): StepModel {

  const parent = allSteps.find(step => step.id === stepToDelete.parentId)
  if (!parent) 
    throw new Error(`Parent not found for step ${stepToDelete.id}`)

  const grandparent = allSteps.find(step => step.id === parent.parentId)
  if (!grandparent && stepToDelete.end === parent.end) 
    throw new Error('Cannot delete the main goal.')

  return (stepToDelete.end === parent.end)
    ? findRightStepToDelete(allSteps, parent)
    : stepToDelete
}

//1. extract the step the user done
//2. spred the other childrens in nexstep logicly
function extractWhenCreateNewStep(
  allSteps: StepModel[], 
  nextStep: StepModel, 
  today: number,
  prevEnd: number,
  createTime: number,

) : StepModel[]{
  let lastFinishedDay = 0
  let firstUnfinishedStep = nextStep

  // extract finished childrens
  let newSteps = allSteps.map(step=>{
      if(step.parentId === nextStep.id){
          if(step.end < today){
              lastFinishedDay = Math.max(lastFinishedDay, step.end)
              return {...step, parentId: nextStep.parentId} 
          }
          else {
              firstUnfinishedStep = 
              step.end < firstUnfinishedStep.end 
              ? step
              : firstUnfinishedStep
              return step
          }
      }
      else return step
  })


  // if there is finished and unfinished childrens
  // adjust unfinished childrens to more logical end
  if(lastFinishedDay !== 0 && firstUnfinishedStep.id !== nextStep.id){
      const ratio = 
          (nextStep.end-prevEnd - (firstUnfinishedStep.end-prevEnd))
          /(nextStep.end-prevEnd - (lastFinishedDay-prevEnd))
      const FirstUnfinishedStepNewEnd = 
          Math.floor(prevEnd + (nextStep.end - prevEnd) - ratio * (nextStep.end - prevEnd))

      const childrens = allSteps.filter(step=>step.parentId === nextStep.id)
      let nextUnfinishedDay = nextStep.end + 1
      const nextUnfinishedStep = childrens.reduce((acc, step)=>{
          if(step.end > firstUnfinishedStep.end && step.end < nextUnfinishedDay)
              return step
          return acc
      },firstUnfinishedStep)

      newSteps = timelineService.changeAllStepsEnd(
        firstUnfinishedStep.end,
        today,
        newSteps,
        {...firstUnfinishedStep, end: FirstUnfinishedStepNewEnd},
        nextUnfinishedStep,
        createTime
      )
  }

  return newSteps
}

function formatDateFromEnd(end: number): string {

  const date = new Date(end * 24 * 60 * 60 * 1000)
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function updateParentsExceptEnd(
  allSteps: StepModel[], 
  changedStep: StepModel, 
  currentStep: StepModel, 
  preEnd: number): StepModel[] {

  const parent = allSteps.find(step => step.id === currentStep.parentId);
  if (parent && preEnd === parent.end) {
    allSteps = allSteps.map(step =>
      step.id === parent.id
        ? { ...changedStep, id: step.id, parentId: step.parentId, end: step.end }
        : step
    );
    return updateParentsExceptEnd(allSteps, changedStep, parent, preEnd);
  }
  return allSteps;
}


function updateLastChildrensExceptEnd(
  allSteps: StepModel[], 
  changedStep: StepModel, 
  currentStep: StepModel, 
  preEnd: number): StepModel[] {

  const lastChild = allSteps.find(step => step.parentId === currentStep.id && step.end === preEnd)
  if (lastChild) {
    allSteps = allSteps.map(step =>
      step.id === lastChild.id
        ? { ...changedStep, id: step.id, parentId: step.parentId, end: step.end }
        : step
    )
    return updateParentsExceptEnd(allSteps, changedStep, lastChild, preEnd)
  }
  return allSteps
}

interface PointModel {
  x: number
  y: number
}

function getTrianglePoints(angleDeg : number, size : number) 
  : {tip: PointModel, left: PointModel, right: PointModel}{
    const angleRad = angleDeg * Math.PI / 180;
    const baseAngle = 140 * Math.PI / 180; // total angle at the tip (between the base corners)
    const tipLength = size; // from center to tip
    const baseLength = size / 2; // from center to each base corner

    // Tip point (forward)
    const tip = {
        x: Math.cos(angleRad) * tipLength,
        y: Math.sin(angleRad) * tipLength
    };

    // Base points (angled left and right from the tip)
    const left = {
        x: Math.cos(angleRad + baseAngle / 2) * baseLength,
        y: Math.sin(angleRad + baseAngle / 2) * baseLength
    };

    const right = {
        x: Math.cos(angleRad - baseAngle / 2) * baseLength,
        y: Math.sin(angleRad - baseAngle / 2) * baseLength
    };

    return {tip, left, right};
}











     