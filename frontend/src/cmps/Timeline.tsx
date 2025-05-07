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
  const [isDragging, setIsDragging] = useState<number | null>(null)

  useEffect(() => {
    setStepsToShow(steps.filter(step=>step.parentId === mainStep.id))
    console.log('mainStep', mainStep)
  }, [mainStep, steps])

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

  function handleRightDown(event: React.MouseEvent){
    event.preventDefault()
    if(event.button === 2)
      if(!isDragging){
        setIsDragging(event.pageX)
      } 
  }

  function handleRightUpOutsideStep(event: React.MouseEvent){
    event.preventDefault()
    if(event.button === 2)
      setIsDragging(null) 
  }

  function handleRightUpInsideStep(event: React.MouseEvent, step: StepModel, prevEnd: number, nextStep: StepModel){
    event.preventDefault()
    if(event.button === 2){
      if(isDragging){
        const distance = event.clientX - isDragging
        if(Math.abs(distance) < 5)
          handleRightClick(event, step, prevEnd, nextStep)
      }
      setIsDragging(null)
    }
      
  }

  function handleRightDrag(event: React.MouseEvent){
    event.preventDefault()
    if(isDragging){
        const distance = event.clientX - isDragging
        const move = (distance >= 5) ? distance - 5 : (distance <= -5) ? distance + 5 : 0
        console.log('move', move)
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
    onMouseUp={event =>handleRightUpOutsideStep(event)}>

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
                onMouseDown={event =>handleRightDown(event)}
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