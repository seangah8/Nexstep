
import { useState, useEffect, useRef } from "react";
import { StepModel, MainStepModel, EditModalModel, DraggingModel } from "../../models/timeline.models";
import { timelineService } from "../../services/timeline.service";
import { utilService } from "../../services/util.service";
import { EditStepModal } from "./EditStepModal";
import { StepPreview } from "./StepPreview";
import { HoverModal } from "./HoverModal";
import { TimelineModel } from "../../models/timeline.models";
import { timelineActions } from "../../store/actions/timeline.actions";


interface TimelineProps{
    timeline : TimelineModel
}

export function Timeline( {timeline } : TimelineProps) {

  // Load UI settings from timeline service
  const { svgSize, svgCenter, radius, spaceDeg, fadeTimeSeconds } = timelineService.getTimelineUISettings()

  const today = timelineService.getToday()

  // const [steps, setSteps] = useState<StepModel[]>(timelineService.getDefultStepsDatabase)
  const [mainStep, setMainStep] = useState<MainStepModel>({ ...timeline.steps[0], start: timeline.createdAt })
  const [stepsToShow, setStepsToShow] = useState<StepModel[] | null>(null)
  const [editModal, setEditModal] = useState<EditModalModel | null>(null)
  const [dragging, setDragging] = useState<DraggingModel | null>(null)
  const [hoveredStep, setHoveredStep] = useState<StepModel | null>(null)
  
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if(!dragging){
      console.log('steps', timeline.steps)
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
    if (event.deltaY > 0) { // User scrolled DOWN
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

      if(distance >= 5 && stepsToShow && svgRef.current) {
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
          const svgRect = svgRef.current.getBoundingClientRect()
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
    if(svgRef.current){
      svgRef.current.style.transition = `opacity ${fadeTimeSeconds}s ease-out`
      svgRef.current.style.opacity = '0'
    }
  }

  function svgFadeInAnimation(){
    if(svgRef.current){
      svgRef.current.style.transition = `opacity ${fadeTimeSeconds}s ease-in`
      svgRef.current.style.opacity = '1'
    }
  }

  if(!stepsToShow) return <h2>Loading...</h2>

  return (
    <section className='time-line' 
    onWheel={handleZoomOut} 
    onMouseMove={event => handleRightDrag(event)}  
    onMouseUp={event =>handleRightUp(event)}>

      <svg width={svgSize} height={svgSize} ref={svgRef}>
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
                svgRef = {svgRef}
                dragging = {dragging}
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

          return (
            <>
              {renderedSteps.reverse()}

              {/* Yellow "Today" circle */}
              {
                (() => {
                  if (today < mainStep.start || today > mainStep.end) return null

                  const todayLocation = timelineService.dayToLocation(
                    svgCenter, mainStep, spaceDeg, radius, today)
                  const todayAngle = spaceDeg / 2 + (today - mainStep.start) / totalDays * (360 - spaceDeg)
                  const traingelPoints = timelineService.getTrianglePoints(todayAngle, 40)

                  return (
                    <polygon
                      points={`${traingelPoints.tip.x + todayLocation.x},${traingelPoints.tip.y + todayLocation.y} 
                      ${traingelPoints.right.x + todayLocation.x},${traingelPoints.right.y + todayLocation.y}
                      ${traingelPoints.left.x + todayLocation.x},${traingelPoints.left.y + todayLocation.y}
                      `}
                      fill="#702228"
                      stroke="white"
                      strokeWidth='3'
                      
                    />
                  ) 
                })()
              }
            </>
          )
        })()}
      </svg>

      { // edit modal 

        editModal &&
        <EditStepModal
          editModal={editModal}
          allSteps={timeline.steps}
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

    </section>
  )
}
