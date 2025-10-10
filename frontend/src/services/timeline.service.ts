import { TimelineModel, MainStepModel, StepModel, MentorQuestionModal } from "../models/timeline.models";
import { httpService } from "./http.service";

export const timelineService = {
  query,
  get,
  remove,
  add,
  update,
  getTimelineUISettings,
  getToday,
  getMentorQuestions,
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

function getMentorQuestions() : MentorQuestionModal[]{
  const mentorQuestions : MentorQuestionModal[] = [
      {
        question: 'How many *hours per week* are you willing to work on this goal?',
        options: [
            {icon: '1-3', title: 'Hours', value: '1-3', description: 'You’ll have limited time each week, but you’ll still make space for what matters. Even short, focused sessions will move you forward if you stay consistent. It’ll be a gentle rhythm — enough to keep your dream alive week by week.'}, 
            {icon: '4-6', title: 'Hours', value: '4-6', description: 'You’ll set aside a steady amount of time to stay connected to your goal. Each session will help you reflect, refocus, and see small steps add up. With intention guiding your effort, every hour will count.'}, 
            {icon: '7-9', title: 'Hours', value: '7-9', description: 'You’ll build a balanced pace of progress — enough time to see meaningful results without losing stability. These hours will strengthen your habits and sense of direction. Your journey will feel productive yet sustainable.'}, 
            {icon: '10-14', title: 'Hours', value: '10-14', description: 'You’ll be treating your goal as a serious weekly pursuit. Regular focus will turn small wins into solid momentum. The consistency you build will define your path toward long-term success.'}, 
            {icon: '15-19', title: 'Hours', value: '15-19', description: 'You’ll be dedicating a significant part of your week to real growth. This level of focus will push you past hesitation and into visible transformation. Your steady commitment will start shaping tangible change in your life.'}, 
            {icon: '20-29', title: 'Hours', value: '20-29', description: 'You’ll be prioritizing your goal as a major part of your routine. Passion and discipline will merge into powerful momentum. At this level, progress will start feeling like a natural part of who you are.'}, 
            {icon: '30-39', title: 'Hours', value: '30-39', description: 'You’ll be approaching your goal with near full-time energy. Each week will bring challenges, breakthroughs, and real movement toward mastery. You’ll feel your dedication turning into visible progress.'}, 
            {icon: '40+', title: 'Hours', value: '40-49', description: 'You’ll be fully committed — living and breathing your ambition each week. This path will demand focus, courage, and persistence, but the rewards will match your drive. You’ll be shaping your future with every hour you invest.'}
        ],
        answer: null
      },
      {
        question: 'Do you prefer a *steady* path or one that takes *bold* leaps forward?',
        options: [
            {icon: '<i class="fa-solid fa-shield-halved"></i>',title: 'Conservative', value: 'conservative', description: 'You’ll take a steady path where each step is secure and well-planned. Progress will build through reliability, patience, and proven methods. It’s the safest way forward — less excitement, but a strong chance of reaching your goal.'},
            {icon: '<i class="fa-solid fa-scale-balanced"></i>',title: 'Balanced', value: 'balanced', description: 'You’ll move forward with a mix of caution and confidence. Some moments will call for careful judgment, others for bold action — and you’ll know how to find that middle ground. This path offers stable progress with just enough flexibility to grow.'},
            {icon: '<i class="fa-solid fa-compass"></i>',title: 'Adaptive', value: 'adaptive', description: 'You’ll stay flexible, learning to adjust your course as conditions change. Not every move will be perfect, but each one will teach you something useful. This mindset will help you turn uncertainty into opportunity while staying grounded.'}, 
            {icon: '<i class="fa-solid fa-fire"></i>',title: 'Bold', value: 'bold', description: 'You’ll take daring steps and trust your instincts when opportunity appears. Some risks may not pay off, but the lessons will sharpen your strategy and courage. It’s a path for those who seek growth through challenge and action.'}, 
            {icon: '<i class="fa-solid fa-rocket"></i>',title: 'Adventurous', value: 'adventurous', description: 'You’ll chase your goal with passion and fearless creativity, venturing beyond what’s familiar. The rewards can be extraordinary, but the path won’t always be predictable or guaranteed. It’s a journey for dreamers who accept risk as the price of discovery.'}, 
        ],
        answer: null
      },
      {
        question: 'How do you preffer your *workflow*?',
        options: [
            {icon: '<i class="fa-solid fa-shield"></i>', title: 'Meticulous', value: 'meticulous', description: 'You’ll move through your goals with patience and precision. Each step will be carefully thought out, leaving little room for mistakes. It’ll be a path of mastery — slower, but deeply rewarding as every detail falls into place.'},
            {icon: '<i class="fa-solid fa-lines-leaning"></i>', title: 'Deliberate', value: 'deliberate', description: 'You’ll take time to plan and act with intention. Progress will come from thoughtful choices and steady focus. Each step will feel meaningful, guided by clarity rather than urgency.'},
            {icon: '<i class="fa-solid fa-scale-balanced"></i>', title: 'Balanced', value: 'balanced', description: 'You’ll find a rhythm between careful planning and forward motion. Some steps will take time, others will move quickly — all at a pace that feels natural. This balance will keep your growth steady and sustainable.'}, 
            {icon: '<i class="fa-solid fa-feather-pointed"></i>', title: 'Fast Paced', value: 'fast-paced', description: 'You’ll keep momentum high, turning ideas into action without hesitation. Progress will come from motion, experimentation, and learning as you go. This approach will bring energy, variety, and a sense of constant movement toward your goal.'}, 
            {icon: '<i class="fa-solid fa-bolt"></i>',title: 'Iterative', value: 'iterative', description: 'You’ll advance through frequent cycles of testing, improving, and refining. Each small win will teach you something new and sharpen your next move. Over time, these quick iterations will evolve into powerful, lasting progress.'}, 
        ],
        answer: null
      },
      {
        question: '*Solo* focus or *team* energy - what drives you?',
        options: [
            {icon: '<i class="fa-solid fa-street-view"></i>', title: 'Solo', value: 'solo', description: 'You’ll work independently, relying on your own focus and discipline. This path gives you full control over your pace, priorities, and creative flow. It may feel isolating at times, but it strengthens your self-direction and clarity of purpose.'},
            {icon: '<i class="fa-solid fa-handshake-angle"></i>', title: 'Hybrid', value: 'hybrid', description: 'You’ll mix independent effort with moments of collaboration. This balance will let you stay self-reliant while gaining perspective and motivation from others. It’s a flexible approach that blends personal freedom with shared energy.'},
            {icon: '<i class="fa-solid fa-people-group"></i>', title: 'Social', value: 'social', description: 'You’ll thrive through connection, teamwork, and shared inspiration. Working with others will keep ideas flowing and motivation high. While it may require compromise and coordination, this path brings energy from community and collective growth.'}, 
        ],
        answer: null
      },
      {
        question: 'What *path* suits you best?',
        options: [

            {icon: '<i class="fa-solid fa-code-branch"></i>', title: 'Path1', value: [
              {
                id: 'path1-id1', 
                parentId: 'idUserGoal', 
                title: 'path1-step1',
                description: 'path1-step1-description', 
                image: 'https://images.icon-icons.com/1558/PNG/512/353412-flag_107497.png', 
                end: 20380
              },
              {
                id: 'path1-id2', 
                parentId: 'idUserGoal', 
                title: 'path1-step2',
                description: 'path1-step1-description', 
                image: 'https://images.icon-icons.com/1558/PNG/512/353412-flag_107497.png', 
                end: 20398
              }
            ], 
            description: 'path1-description path1-description path1-description path1-description path1-description path1-description path1-description path1-description path1-description path1-description path1-description path1-description '
          },

            {icon: '<i class="fa-solid fa-code-merge"></i>', title: 'Path2', value: [
              {
                id: 'path2-id1', 
                parentId: 'idUserGoal', 
                title: 'path2-step1',
                description: 'path2-step1-description', 
                image: 'https://images.icon-icons.com/1558/PNG/512/353412-flag_107497.png', 
                end: 20388
              }
            ], 
            description: 'path2-description path2-description path2-description path2-description path2-description path2-description path2-description path2-description path2-description path2-description path2-description path2-description path2-description path2-description '
          },

            {icon: '<i class="fa-solid fa-code-fork"></i>', title: 'Path3', value: [
              {
                id: 'path3-id1', 
                parentId: 'idUserGoal', 
                title: 'path3-step1',
                description: 'path3-step1-description', 
                image: 'https://images.icon-icons.com/1558/PNG/512/353412-flag_107497.png', 
                end: 20375
              },
              {
                id: 'path3-id2', 
                parentId: 'idUserGoal', 
                title: 'path3-step2',
                description: 'path3-step1-description', 
                image: 'https://images.icon-icons.com/1558/PNG/512/353412-flag_107497.png', 
                end: 20385
              },
              {
                id: 'path3-id3', 
                parentId: 'idUserGoal', 
                title: 'path3-step3',
                description: 'path3-step3-description', 
                image: 'https://images.icon-icons.com/1558/PNG/512/353412-flag_107497.png', 
                end: 20410
              }
            ], 
            description: 'path3-description path3-description path3-description path3-description path3-description path3-description path3-description path3-description path3-description path3-description path3-description path3-description path3-description path3-description path3-description '
          },
        ],
        answer: null
      },

  ]
  return mentorQuestions
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











     