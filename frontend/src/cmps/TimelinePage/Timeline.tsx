
import { useState, useEffect, useRef } from "react";
import { StepModel, MainStepModel, editModalModel, draggingModel } from "../../models/timeline.models";
import { timelineService } from "../../services/timeline.service";
import { EditStepModal } from "./EditStepModal";
import { StepPreview } from "./StepPreview";
import { HoverModal } from "./HoverModal";

export function Timeline() {

  // Load UI settings from timeline service
  const { svgSize, svgCenter, radius, spaceDeg, strokeWidth } = timelineService.getTimelineUISettings()

  // The time the timeline was created (unchangeable)
  const createTime = timelineService.getCreateTime()
  const today = timelineService.getToday()

  const [steps, setSteps] = useState<StepModel[]>(timelineService.getStepsDatabase)
  const [mainStep, setMainStep] = useState<MainStepModel>({ ...steps[0], start: createTime })
  const [stepsToShow, setStepsToShow] = useState<StepModel[] | null>(null)
  const [editModal, setEditModal] = useState<editModalModel | null>(null)
  const [dragging, setDragging] = useState<draggingModel | null>(null)
  const [hoveredStep, setHoveredStep] = useState<StepModel | null>(null)
  
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if(!dragging){
      console.log('steps', steps)
      setStepsToShow(timelineService.sortByEnd(
        steps.filter(step=>step.parentId === mainStep.id)
      ))
      onSetHoveredStep(null)
    }
  }, [steps, mainStep])

  function onSetSteps(newSteps: StepModel[]): void {
    setSteps(newSteps)
  }

  function onSetMainStep(newMainStep : MainStepModel){
    setMainStep(newMainStep)
  }

  function onSetMainStepEnd(end: number): void {
    setMainStep(prev => ({ ...prev, end: end }))
  }

  function onSetEditModal(newEditModal: editModalModel | null): void {
    setEditModal(newEditModal)
  }

  function onAddingStep(newStep : StepModel){
    setSteps(prev=> [...prev, newStep])
  }

  function onSetDragging(newDragging: draggingModel | null){
    setDragging(newDragging)
  }

  function onSetHoveredStep(step: StepModel | null){
    setHoveredStep(step)
  }

  function handleZoomOut(event: React.WheelEvent) {
    if (event.deltaY > 0) { // User scrolled DOWN
      const parentStep = steps.find(step => step.id === mainStep.parentId)
      if (!parentStep) return

      // Go up to parent
      const prevParentEnd = timelineService.findParentStart(steps, parentStep, createTime)
      setMainStep({ ...parentStep, start: prevParentEnd })
    }
  }

  function handleRightUp(event: React.MouseEvent){
    event.preventDefault()
    if(event.button === 2 && stepsToShow && dragging){

      const stepIndex = stepsToShow.findIndex(step => 
        step.id === dragging.druggingStep.id)
      const parentLimit = timelineService.findStepTotalMaxEnd(steps,
        {...dragging.druggingStep, end: stepsToShow[stepIndex].end})
      const changedStep = {...dragging.druggingStep, 
        end: Math.min(stepsToShow[stepIndex].end, parentLimit)
      }
      
      // first change the step user edited
      let newSteps = steps.map(step => 
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
          createTime
        )

      if(mainStep.end > parentLimit)
        onSetMainStep({...mainStep, end: parentLimit})

      setSteps(newSteps)
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

  if(!stepsToShow) return <h2>Loading...</h2>

  return (
    <section className='time-line' 
    onWheel={handleZoomOut} 
    onMouseMove={event => handleRightDrag(event)}  
    onMouseUp={event =>handleRightUp(event)}>

      <h2>Timeline</h2>
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
                allSteps = {steps}
                mainStep = {mainStep}
                stepsToShow = {stepsToShow}
                prevEnd = {prevEnd}
                stepLocation = {stepLocation}
                today = {today}
                createTime = {createTime}
                svgRef = {svgRef}
                dragging = {dragging}
                onSetSteps = {onSetSteps}
                onSetMainStep = {onSetMainStep}
                onSetEditModal = {onSetEditModal}
                onSetDragging = {onSetDragging}
                onAddingStep = {onAddingStep}
                onSetHoveredStep = {onSetHoveredStep}
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

                  return (
                    <circle
                      cx={todayLocation.x}
                      cy={todayLocation.y}
                      r={strokeWidth/2}
                      fill="yellow"
                      stroke="black"
                      strokeWidth="2"
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
          allSteps={steps}
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
