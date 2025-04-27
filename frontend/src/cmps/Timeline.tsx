import { utilService } from "../services/util.service"
import { useState } from "react";
import { StepModel, MainStepModel } from "../models/timeline.models";
import { timelineService } from "../services/timeline.service";

function Timeline() {



  const steps : StepModel[] = [
    { id: 'idUserGoal', title:'Users Goal', parent: null, end: 350},
    {id: 'idS1', parent: 'idUserGoal', title: 'S1', end: 150},
    {id: 'idS2' ,parent: 'idUserGoal', title: 'S2', end: 180},
    {id: 'idS3' ,parent: 'idUserGoal', title: 'S3', end: 240},
    {id: 'idS4' ,parent: 'idUserGoal', title: 'S4', end: 330},
    {id: 'idG' ,parent: 'idUserGoal', title: 'G', end: 350},
    {id: 'idG.F' ,parent: 'idG', title: 'G.F', end: 335},
    {id: 'idG.G' ,parent: 'idG', title: 'G.G', end: 350}
  ]

  const createTime = 100


  const [mainStep, setMainStep] = useState<MainStepModel>({...steps[0], start: createTime})


  // some UI controle
  const svgSize = 600
  const pathCenter = {x: 300, y: 300}
  const radius = 250
  const spaceDeg = 60
  const strokeWidth = 30
  const circlesSize = 35

  function onSelectStep(selectStep : StepModel, prevEnd: number, stepsToShow : StepModel[]){
    if(stepsToShow.length <= 1) throw new Error('There are no further steps!')
    else setMainStep({...selectStep, start: prevEnd})
  }
  
  function handleZoomOut(event: React.WheelEvent) {

    if (event.deltaY > 0) { // User scrolled DOWN
      const parentStep = steps.find(step => step.id === mainStep.parent)
      if (!parentStep) return
  
      // Go up to parent
      const prevParentEnd = timelineService.findParentStart(steps, parentStep, createTime)
      setMainStep({ ...parentStep, start: prevParentEnd })
    }
  }

  function handleZoomIn(event: React.WheelEvent, selectStep : StepModel, prevEnd: number, stepsToShow: StepModel[]) {
    if (event.deltaY < 0) { // User scrolled Up
      onSelectStep(selectStep, prevEnd, stepsToShow)
    }
  }


  return (
    <section className='time-line' onWheel={handleZoomOut}>
      <h2>Timeline</h2>
      <svg width={svgSize} height={svgSize}>
        {(() => {
          const totalDays = mainStep.end - mainStep.start
          const angleRange = 360 - spaceDeg
          let accumulated = 0

          const stepsToShow: StepModel[] = steps.filter(step=>step.parent === mainStep.id)
          if(stepsToShow.length <= 0) {
            const { start, ...mainStepWithoutStart } = mainStep
            stepsToShow.push(mainStepWithoutStart)
          }

          const renderedSteps = stepsToShow.map((step, index) => {
            const prevEnd = stepsToShow[index - 1]?.end ?? mainStep.start
            const stepDays = step.end - prevEnd
            const stepAngle = (stepDays / totalDays) * angleRange
            const startAngle = spaceDeg / 2 + (accumulated / totalDays) * angleRange
            const endAngle = startAngle + stepAngle
            accumulated += stepDays

            const angleRad = (endAngle - 90) * (Math.PI / 180)
            const stepCircleX = pathCenter.x + radius * Math.cos(angleRad)
            const stepCircleY = pathCenter.y + radius * Math.sin(angleRad)

            return (
              <g key={step.id} onClick={()=>onSelectStep(step, prevEnd, stepsToShow)} onWheel={event=>handleZoomIn(event,step, prevEnd, stepsToShow)}>
                <path
                  d={utilService.describeArc(pathCenter.x, pathCenter.y, radius, startAngle, endAngle)}
                  stroke={index % 2 === 0 ? "blue" : "red"}
                  strokeWidth={strokeWidth}
                  fill='none'
                />
                <circle
                  cx={stepCircleX}
                  cy={stepCircleY}
                  r={circlesSize}
                  fill={index % 2 === 0 ? "blue" : "red"}
                  stroke="black"
                  strokeWidth='2'
                />
                <text
                  x={stepCircleX}
                  y={stepCircleY+6}
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

          return renderedSteps.reverse() // Reverse the JSX elements so circles will be in front
        })()}
      </svg>


    </section>
  )
}
  
export default Timeline