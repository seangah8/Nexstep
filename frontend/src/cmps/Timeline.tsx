import { utilService } from "../services/util.service"
import { useState, useEffect } from "react";
import { StepModel, MainStepModel, editModalModel } from "../models/timeline.models";
import { timelineService } from "../services/timeline.service";
import { EditStepModal } from "./EditStepModal";

function Timeline() {

  // Load UI settings from timeline service
  const { svgSize, svgCenter, radius, spaceDeg, strokeWidth, circlesSize } = timelineService.getTimelineUISettings()

  // The time the timeline was created (unchangeable)
  const createTime = 100
  const today = 120

  const [steps, setSteps] = useState<StepModel[]>(timelineService.getStepsDatabase)
  const [mainStep, setMainStep] = useState<MainStepModel>({ ...steps[0], start: createTime })
  const [stepsToShow, setStepsToShow] = useState<StepModel[] | null>(null)
  const [editModal, setEditModal] = useState<editModalModel | null>(null)
  const [dragging, setDragging] = useState<{startPoint: number, druggingStep: StepModel} | null>(null)

  useEffect(() => {
    if(!dragging){
      console.log('steps', steps)
      setStepsToShow(timelineService.sortByEnd(
        steps.filter(step=>step.parentId === mainStep.id)
      ))
    }
  }, [steps, mainStep])

  function onUpdateSteps(newSteps: StepModel[]): void {
    setSteps(newSteps)
  }

  function onUpdateMainStepEnd(end: number): void {
    setMainStep(prev => ({ ...prev, end: end }))
  }

  function onUpdateEditModal(newEditModal: editModalModel | null): void {
    setEditModal(newEditModal)
  }

  function onSelectStep(selectStep: StepModel, prevEnd: number, stepsToShow: StepModel[]) {
    console.log('selectStep', { ...selectStep, start: prevEnd })
    if (stepsToShow.length <= 1) throw new Error('There are no further steps!')
    else setMainStep({ ...selectStep, start: prevEnd })
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

  function handleZoomIn(event: React.WheelEvent, selectStep: StepModel, prevEnd: number, stepsToShow: StepModel[]) {
    if (event.deltaY < 0) { // User scrolled Up
      onSelectStep(selectStep, prevEnd, stepsToShow)
    }
  }

  function handleRightDown(event: React.MouseEvent, step: StepModel){
    event.preventDefault()
    if(event.button === 2)
      if(!dragging && step.end >= today){
        setDragging({startPoint: event.pageX, druggingStep: step })
      } 
  }

  function handleRightUp(event: React.MouseEvent){
    event.preventDefault()
    if(event.button === 2 && stepsToShow && dragging){

      const stepIndex = stepsToShow.findIndex(step => 
        step.id === dragging.druggingStep.id)
      const changedStep = {...dragging.druggingStep, end: stepsToShow[stepIndex].end}
      
      // first change the step user edited
      let newSteps = steps.map(step => 
        (step.id === dragging.druggingStep.id) 
        ? changedStep
        : step
      )
              
      const preStart = (stepIndex === 0) ? mainStep.start : stepsToShow[stepIndex-1].end
      const nextStep = (stepIndex === stepsToShow.length-1) ? null : stepsToShow[stepIndex+1]
      newSteps = timelineService.changeCurrantAndNextStepsEnd(
        preStart,
        dragging.druggingStep.end,
        today,
        newSteps,
        changedStep,
        nextStep,
      )

      setSteps(newSteps)
      setDragging(null)
    }
 
  }

  function handleRightUpInsideStep(event: React.MouseEvent, step: StepModel, prevEnd: number, nextStep: StepModel){
    event.preventDefault()
    if(event.button === 2 && dragging){
      const distance = event.clientX - dragging.startPoint
      if(Math.abs(distance) < 5)
        handleRightClick(event, step, prevEnd, nextStep)
    }
      
  }

  function handleRightDrag(event: React.MouseEvent){
    event.preventDefault()
    if(dragging && stepsToShow){

        const distance = event.clientX - dragging.startPoint
        const move = (distance >= 5) ? distance - 5 : (distance <= -5) ? distance + 5 : 0
        const totalDays = mainStep.end - mainStep.start
        const stepIndex = stepsToShow.findIndex(step => step.id === dragging.druggingStep.id)
        let newEnd = Math.floor(dragging.druggingStep.end - ((move / 1000) * totalDays))

        if(stepIndex === 0 && newEnd < mainStep.start)
          newEnd = mainStep.start
        else if (stepIndex !== 0 && newEnd <= stepsToShow[stepIndex-1].end)
          newEnd = stepsToShow[stepIndex-1].end + 1
        else if (stepIndex !== stepsToShow.length-1 && newEnd >= stepsToShow[stepIndex+1].end)
          newEnd = stepsToShow[stepIndex+1].end - 1
        if(newEnd <= today)
          newEnd = today + 1


        if(stepIndex === stepsToShow.length-1){
          setMainStep(prev=> ({...prev, end: newEnd}))
        }

        setStepsToShow(prev => {
          if (!prev) return prev
          return prev.map(step =>
            step.id === dragging.druggingStep.id
              ? { ...step, end: newEnd }
              : step
          )
        })
    }
  }

  function handleRightClick(event: React.MouseEvent, step: StepModel, prevEnd: number, nextStep: StepModel) {
    event.preventDefault()
    if(event.button === 2 && step.end > today){
        setEditModal({ 
          step: step, 
          start: prevEnd, 
          nextStep: nextStep, 
          today: today, 
          createTime: createTime })
    }
  }

  if(!stepsToShow) return <h2>Loading...</h2>

  return (
    <section className='time-line' 
    onWheel={handleZoomOut} 
    onMouseMove={event => handleRightDrag(event)}  
    onMouseUp={event =>handleRightUp(event)}>

      <h2>Timeline</h2>
      <svg width={svgSize} height={svgSize}>
        {(() => {
          const totalDays = mainStep.end - mainStep.start
          let accumulated = 0

          if (stepsToShow.length <= 0) {
            const { start, ...mainStepWithoutStart } = mainStep
            setStepsToShow([mainStepWithoutStart])
          }

          const renderedSteps = stepsToShow.map((step, index) => {
            const prevEnd = stepsToShow[index - 1]?.end ?? mainStep.start
            const nextStep = stepsToShow[index + 1] ?? null
            const stepLocation = timelineService.DayToStepLocation(
              step, svgCenter, totalDays, spaceDeg, radius, prevEnd, accumulated)

            accumulated += step.end - prevEnd

            return (
              <g key={step.id}
                onClick={() => onSelectStep(step, prevEnd, stepsToShow)}
                onWheel={event => handleZoomIn(event, step, prevEnd, stepsToShow)}
                onMouseDown={event =>handleRightDown(event, step)}
                onMouseUp={event => handleRightUpInsideStep(event, step, prevEnd, nextStep)}
                >
                
                <path
                  d={utilService.describeArc(svgCenter.x, 
                    svgCenter.y, 
                    radius, 
                    stepLocation.angleRange.start, 
                    stepLocation.angleRange.end)}

                  stroke={step.end < today ? "green" : "#389BBA"}
                  strokeWidth={strokeWidth}
                  fill='none'
                />
                <circle
                  cx={stepLocation.circleLocation.x}
                  cy={stepLocation.circleLocation.y}
                  r={circlesSize}
                  fill={step.end < today ? "green" : "#389BBA"}
                  stroke="black"
                  strokeWidth='2'
                />
                <text
                  x={stepLocation.circleLocation.x}
                  y={stepLocation.circleLocation.y + 6}
                  textAnchor="middle"
                  fontSize="16"
                  fill="white"
                  fontFamily="Arial"
                >
                  {step.title}
                </text>
              </g>
            )
          })

          return (
            <>
              {renderedSteps.reverse()}

              {/* Yellow "Today" circle */}
              {
                (() => {
                  if (today < mainStep.start || today > mainStep.end) return null

                  const todayLocation = timelineService.DayToTodayLocation(
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

      {
        editModal &&
        <EditStepModal
          editModal={editModal}
          allSteps={steps}
          onUpdateSteps={onUpdateSteps}
          onUpdateMainStepEnd={onUpdateMainStepEnd}
          onUpdateEditModal={onUpdateEditModal}
        />
      }

    </section>
  )
}

export default Timeline


// 2. make sense when drag the last
// 3. after dragging, update on storage!