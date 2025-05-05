import { utilService } from "../services/util.service"
import { useState, useEffect } from "react";
import { StepModel, MainStepModel, editModalModel } from "../models/timeline.models";
import { timelineService } from "../services/timeline.service";
import { EditStepModal } from "./EditStepModal";

function Timeline() {

  // Load UI settings from timeline service
  const { svgSize, pathCenter, radius, spaceDeg, strokeWidth, circlesSize } = timelineService.getTimelineUISettings()

  // The time the timeline was created (unchangeable)
  const createTime = 100
  const today = 120

  const [steps, setSteps] = useState<StepModel[]>(timelineService.getStepsDatabase)
  const [mainStep, setMainStep] = useState<MainStepModel>({ ...steps[0], start: createTime })
  const [editModal, setEditModal] = useState<editModalModel | null>(null)

  useEffect(() => {
    console.log('mainStep', mainStep)
  }, [mainStep])

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

  function handleRightClick(event: React.MouseEvent, step: StepModel, prevEnd: number, nextStep: StepModel) {
    event.preventDefault()
    if(step.end > today)
      setEditModal({ 
        step: step, 
        start: prevEnd, 
        nextStep: nextStep, 
        today: today, 
        createTime: createTime })
  }

  return (
    <section className='time-line' onWheel={handleZoomOut}>
      <h2>Timeline</h2>
      <svg width={svgSize} height={svgSize}>
        {(() => {
          const totalDays = mainStep.end - mainStep.start
          const angleRange = 360 - spaceDeg
          let accumulated = 0

          const stepsToShow: StepModel[] = steps.filter(step => step.parentId === mainStep.id)
          if (stepsToShow.length <= 0) {
            const { start, ...mainStepWithoutStart } = mainStep
            stepsToShow.push(mainStepWithoutStart)
          }

          const renderedSteps = stepsToShow.map((step, index) => {
            const prevEnd = stepsToShow[index - 1]?.end ?? mainStep.start
            const nextStep = stepsToShow[index + 1] ?? null
            const stepDays = step.end - prevEnd
            const stepAngle = (stepDays / totalDays) * angleRange
            const startAngle = spaceDeg / 2 + (accumulated / totalDays) * angleRange
            const endAngle = startAngle + stepAngle
            accumulated += stepDays

            const angleRad = (endAngle - 90) * (Math.PI / 180)
            const stepCircleX = pathCenter.x + radius * Math.cos(angleRad)
            const stepCircleY = pathCenter.y + radius * Math.sin(angleRad)

            return (
              <g key={step.id}
                onClick={() => onSelectStep(step, prevEnd, stepsToShow)}
                onWheel={event => handleZoomIn(event, step, prevEnd, stepsToShow)}
                onContextMenu={event => handleRightClick(event, step, prevEnd, nextStep)}>
                <path
                  d={utilService.describeArc(pathCenter.x, pathCenter.y, radius, startAngle, endAngle)}
                  stroke={step.end < today ? "green" : "#389BBA"}
                  strokeWidth={strokeWidth}
                  fill='none'
                />
                <circle
                  cx={stepCircleX}
                  cy={stepCircleY}
                  r={circlesSize}
                  fill={step.end < today ? "green" : "#389BBA"}
                  stroke="black"
                  strokeWidth='2'
                />
                <text
                  x={stepCircleX}
                  y={stepCircleY + 6}
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

                  const totalDays = mainStep.end - mainStep.start
                  const angleRange = 360 - spaceDeg
                  const daysFromStart = today - mainStep.start
                  const todayAngle = spaceDeg / 2 + (daysFromStart / totalDays) * angleRange

                  const todayRad = (todayAngle - 90) * (Math.PI / 180)
                  const todayX = pathCenter.x + radius * Math.cos(todayRad)
                  const todayY = pathCenter.y + radius * Math.sin(todayRad)

                  return (
                    <circle
                      cx={todayX}
                      cy={todayY}
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
