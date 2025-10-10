
import { useState, useEffect, useRef } from "react";
import { StepModel, MainStepModel, EditModalModel, DraggingModel, OptionModal } from "../../models/timeline.models";
import { timelineService } from "../../services/timeline.service";
import { utilService } from "../../services/util.service";
import { EditStepModal } from "./EditStepModal";
import { StepPreview } from "./StepPreview";
import { HoverModal } from "./HoverModal";
import { TimelineModel } from "../../models/timeline.models";
import { timelineActions } from "../../store/actions/timeline.actions";
import { TodayPointer } from "./TodayPointer";
import { Mentor } from "./Mentor";
import { HoverOptionModal } from "./HoverOptionModal";


interface TimelineProps{
    timeline : TimelineModel
}

export function Timeline( { timeline } : TimelineProps) {

  // Load UI settings from timeline service
  const { svgSize, svgCenter, radius, spaceDeg, fadeTimeSeconds } = timelineService.getTimelineUISettings()

  const today = timelineService.getToday()

  const [mainStep, setMainStep] = useState<MainStepModel>({ ...timeline.steps[0], start: timeline.createdAt })
  const [stepsToShow, setStepsToShow] = useState<StepModel[] | null>(null)
  const [editModal, setEditModal] = useState<EditModalModel | null>(null)
  const [dragging, setDragging] = useState<DraggingModel | null>(null)
  const [hoveredStep, setHoveredStep] = useState<StepModel | null>(null)
  const [isMentorOpen, setIsMentorOpen] = useState<boolean>(false)
  const [hoveredOption, setHoveredOption] = useState<OptionModal | null>(null)
  
  const timelineSvgRef = useRef<SVGSVGElement | null>(null)
  const todayPointerSvgRef = useRef<SVGSVGElement | null>(null)

  // in case you connect to diffrent user change the main step
  useEffect(()=>{
    if(!mainStep.parentId && mainStep !== timeline.steps[0])
      setMainStep({ ...timeline.steps[0], start: timeline.createdAt })
  },[timeline])

  useEffect(() => {
    if(!dragging){
      setStepsToShow(timelineService.sortByEnd(
        timeline.steps.filter(step=>step.parentId === mainStep.id)
      ))
      onSetHoveredStep(null)
    }
  }, [timeline.steps, mainStep])
  
  function onSetSteps(newSteps: StepModel[]): void {
    timelineActions.saveTimeline({...timeline, steps: newSteps})
  }

  function onSetMainStep(newMainStep : MainStepModel){
    setMainStep(newMainStep)
  }

  function onSetMainStepEnd(end: number): void {
    setMainStep(prev => ({ ...prev, end: end }))
  }

  function onSetEditModal(newEditModal: EditModalModel | null): void {
    setEditModal(newEditModal)
  }

  function onAddingStep(newStep : StepModel){
    onSetSteps([...timeline.steps, newStep])
  }

  function onSetDragging(newDragging: DraggingModel | null){
    setDragging(newDragging)
  }

  function onSetHoveredStep(step: StepModel | null){
    setHoveredStep(step)
  }

  async function handleZoomOut(event: React.WheelEvent) {
    if (event.deltaY > 0 && !isMentorOpen) { // User scrolled DOWN
      const parentStep = timeline.steps.find(step => step.id === mainStep.parentId)
      if (!parentStep) return

      // Go up to parent
      svgFadeOutAnimation()
      await utilService.delay(fadeTimeSeconds*1000)
      const prevParentEnd = timelineService.findParentStart(timeline.steps, parentStep, timeline.createdAt)
      setMainStep({ ...parentStep, start: prevParentEnd })
      svgFadeInAnimation()
    }
  }

  function handleRightUp(event: React.MouseEvent){
    event.preventDefault()
    if(event.button === 2 && stepsToShow && dragging){

      const stepIndex = stepsToShow.findIndex(step => 
        step.id === dragging.druggingStep.id)
      const parentLimit = timelineService.findStepTotalMaxEnd(timeline.steps,
        {...dragging.druggingStep, end: stepsToShow[stepIndex].end})
      const changedStep = {...dragging.druggingStep, 
        end: Math.min(stepsToShow[stepIndex].end, parentLimit)
      }
      
      // first change the step user edited
      let newSteps = timeline.steps.map(step => 
        (step.id === dragging.druggingStep.id) 
        ? changedStep
        : step
      )
              
      const preStart = (stepIndex === 0) ? mainStep.start : stepsToShow[stepIndex-1].end
      const nextStep = (stepIndex === stepsToShow.length-1) ? null : stepsToShow[stepIndex+1]

      if(!dragging.onShift)
        newSteps = timelineService.changeCurrantAndNextStepsEnd(
          preStart,
          dragging.druggingStep.end,
          today,
          newSteps,
          changedStep,
          nextStep,
        )
      else 
        newSteps = timelineService.changeAllStepsEnd(
          dragging.druggingStep.end,
          today,
          newSteps,
          changedStep,
          nextStep,
          timeline.createdAt
        )

      if(mainStep.end > parentLimit)
        onSetMainStep({...mainStep, end: parentLimit})

      onSetSteps(newSteps)
      setDragging(null)
    }
 
  }

  function handleRightDrag(event: React.MouseEvent){
    event.preventDefault()
    if(dragging){
      const distance = Math.sqrt(
        (event.clientX - dragging.startPoint.x) ** 2 + 
        (event.clientY - dragging.startPoint.y) ** 2)

      if(distance >= 5 && stepsToShow && timelineSvgRef.current) {
        // calculate the new position
        const Mouselocation = {x: event.pageX, y: event.pageY}
        let newEnd = 0

        // if you drag the last step in main
        if(dragging.druggingStep.id === stepsToShow[stepsToShow.length-1].id){
          const Interval = (event.clientX - dragging.startPoint.x) - (event.clientY - dragging.startPoint.y)
          const move = (Interval >= 5) ? Interval - 5 : (Interval <= -5) ? Interval + 5 : 0
          const totalDays = mainStep.end - mainStep.start
          newEnd = Math.floor(dragging.druggingStep.end + ((move / 750) * totalDays))
        }
        // if you drag any other step
        else{
          const svgRect = timelineSvgRef.current.getBoundingClientRect()
          const svgLocation = {x: svgRect.x, y: svgRect.y}
          newEnd = timelineService.locationToDay(svgCenter, svgLocation, mainStep, spaceDeg, Mouselocation)
        }

        const stepIndex = stepsToShow.findIndex(step => step.id === dragging.druggingStep.id)
        const minEnd = stepIndex === 0 ? mainStep.start : stepsToShow[stepIndex-1].end
        const maxEnd = stepIndex === stepsToShow.length-1 ? Number.MAX_SAFE_INTEGER : stepsToShow[stepIndex+1].end


        // borders
        if (newEnd <= minEnd)
          newEnd = minEnd + 1
        else if (newEnd >= maxEnd)
          newEnd = maxEnd - 1
        if(newEnd <= today)
          newEnd = today + 1

        // last step drag
        if(stepIndex === stepsToShow.length-1)
          setMainStep(prev=> ({...prev, end: newEnd}))
        
        setStepsToShow(prev => {
          if (!prev) return prev
          return prev.map((step, index) =>{
            if(step.id === dragging.druggingStep.id)
              return { ...step, end: newEnd }
            else {
              // if the user shift while drag
              if(dragging.onShift && step.end >= today){

                // steps before the changed one
                if(step.end < newEnd){
                  const isTodayInsideMainstep = (today > mainStep.start && today < mainStep.end)
                  const refPoint = isTodayInsideMainstep ? today : mainStep.start
                  const ratio = (newEnd - refPoint)/(dragging.druggingStep.end - refPoint)
                  return {...step, end: Math.floor(refPoint + (dragging.prevStepsToSow[index].end - refPoint) * ratio)}
                }

                // steps after the changed one
                else{
                  const ratio = (mainStep.end - newEnd)/(mainStep.end - dragging.druggingStep.end)
                  return {...step, end: Math.floor(mainStep.end - (mainStep.end - dragging.prevStepsToSow[index].end) * ratio)}
                }
              }

              // if the user dont shift while drag
              else return step
            }  
          })
        })
      }
    }
  }

  function svgFadeOutAnimation(){
    if(timelineSvgRef.current){
      timelineSvgRef.current.style.transition = `opacity ${fadeTimeSeconds}s ease-out`
      timelineSvgRef.current.style.opacity = '0'

      if(todayPointerSvgRef.current){
        todayPointerSvgRef.current.style.transition = `opacity ${fadeTimeSeconds}s ease-out`
        todayPointerSvgRef.current.style.opacity = '0'
      }
    }
  }

  function svgFadeInAnimation(){
    if(timelineSvgRef.current){
      timelineSvgRef.current.style.transition = `opacity ${fadeTimeSeconds}s ease-in`
      timelineSvgRef.current.style.opacity = '1'

      if(todayPointerSvgRef.current){
        todayPointerSvgRef.current.style.transition = `opacity ${fadeTimeSeconds}s ease-in`
        todayPointerSvgRef.current.style.opacity = '1'
      }
    }
  }

  function daysFontRems(days : number) : number{
    const digitCount = Math.floor(Math.log10(Math.abs(days))) + 1 
    return digitCount > 5 ? 2.5 - ((digitCount - 5) / 8) : 2.5
  }

function replaceSubStepsWithMentorSteps(steps: StepModel[]): void {
  let updatedSteps: StepModel[] = [...timeline.steps]
  let newSteps: StepModel[] = [...steps]

  // validate new steps to be under the main step
  newSteps = newSteps.map(step => {
    if (step.end > mainStep.end || step.end < mainStep.start || step.end < today) 
      throw new Error('Invalid step date')
    return { ...step, parentId: mainStep.id }
  })

  let isThereLastStep = false

  // delete all steps under the current main step
  timeline.steps.forEach(step => {
    if(step.end === mainStep.end && step.id !== mainStep.id) isThereLastStep = true
    if (step.parentId === mainStep.id && step.end < mainStep.end)
      updatedSteps = timelineService.deleteStep(updatedSteps, step, today)
  })

  // if step was empty - add last child step
  if(!isThereLastStep){
    const lastChild : StepModel = {            
      id: utilService.createId(),
      parentId: mainStep.id,
      title: mainStep.title,
      description: mainStep.description,
      image: mainStep.image,
      end: mainStep.end
    }

    updatedSteps = [...updatedSteps, lastChild]
  }

  // add new steps
  updatedSteps = [...updatedSteps, ...newSteps]

  // update timeline steps
  onSetSteps(updatedSteps)
}


  if(!stepsToShow) return <h2>Loading...</h2>

  return (
    <section className='timeline' 
    onWheel={handleZoomOut} 
    onMouseMove={event => handleRightDrag(event)}  
    onMouseUp={event =>handleRightUp(event)}>

      <div className="timeline-body">

        <svg width={svgSize} height={svgSize} ref={timelineSvgRef}>
          {(() => {
            const totalDays = mainStep.end - mainStep.start
            let accumulated = 0

            if (stepsToShow.length <= 0) {
              const { start, ...mainStepWithoutStart } = mainStep
              setStepsToShow([{...mainStepWithoutStart, id: `${mainStep.id}-dummy`, parentId: mainStep.id}])
            }

            const renderedSteps = stepsToShow.map((step, index) => {
              const prevEnd = stepsToShow[index - 1]?.end ?? mainStep.start
              const nextStep = stepsToShow[index + 1] ?? null
              const stepLocation = timelineService.dayToStepLocation(
                step, svgCenter, totalDays, spaceDeg, radius, prevEnd, accumulated)

              accumulated += step.end - prevEnd

              return (
                <StepPreview key={step.id}
                  step = {step}
                  nextStep = {nextStep}
                  allSteps = {timeline.steps}
                  mainStep = {mainStep}
                  stepsToShow = {stepsToShow}
                  prevEnd = {prevEnd}
                  stepLocation = {stepLocation}
                  today = {today}
                  createTime = {timeline.createdAt}
                  svgRef = {timelineSvgRef}
                  dragging = {dragging}
                  isMentorOpen={isMentorOpen}
                  onSetSteps = {onSetSteps}
                  onSetMainStep = {onSetMainStep}
                  onSetEditModal = {onSetEditModal}
                  onSetDragging = {onSetDragging}
                  onAddingStep = {onAddingStep}
                  onSetHoveredStep = {onSetHoveredStep}
                  svgFadeOutAnimation={svgFadeOutAnimation}
                  svgFadeInAnimation={svgFadeInAnimation}
                />
              )
            })

            return ( <> {renderedSteps.reverse()} </>)

          })()}
        </svg>

        <p className="main-step-days" style={today > mainStep.end ? {color: '#c69a3c'} : {}}>
          <span style={{fontSize: `${daysFontRems(mainStep.end - mainStep.start)}rem`}}>
            {mainStep.end - mainStep.start}
          </span>
          <span>Days</span>
        </p>

        {
          (today >= mainStep.start && today <= mainStep.end) &&
          <TodayPointer
            svgCenter={svgCenter}
            spaceDeg={spaceDeg}
            radius={radius}
            totalDays={mainStep.end - mainStep.start}
            mainStep={mainStep}
            today={today}
            svgRef={todayPointerSvgRef}
          />
        }

        <Mentor
          isMentorOpen={isMentorOpen}
          setIsMentorOpen={setIsMentorOpen}
          replaceSteps={replaceSubStepsWithMentorSteps}
          setHoveredOption={setHoveredOption}
        />

      </div>

     
      <div className="timeline-modals">

        { // edit modal 

          editModal &&
          <EditStepModal
            editModal={editModal}
            allSteps={timeline.steps}
            isMentorOpen={isMentorOpen}
            onSetSteps={onSetSteps}
            onSetMainStep={onSetMainStep}
            onSetMainStepEnd={onSetMainStepEnd}
            onSetEditModal={onSetEditModal}
          />
        }

        { // hover modal

          hoveredStep && !editModal &&
          <HoverModal
            step={hoveredStep}
            today={today}
          />
        }


        {
          isMentorOpen &&
          <HoverOptionModal 
            option={hoveredOption}
            mainStep={mainStep}
          />
        }

      </div>

      

    </section>
  )
}
