import { utilService } from "../services/util.service"
import { useState } from "react";

function Timeline() {

  interface StepModel {
    title: string
    end: number
    steps: StepModel[]
  }
  
  interface MainStepModel extends  StepModel{
    start: number
  }

  //  IMPORTANT RULE
  // if a step user select has no steps the website will render a fake step 
  // that not exists in database. if and the user will add later step on this
  // fake step, there will be add so db two steps, one the user creted and another
  // which is the step to end the main step.
  // that means, in database there will be no steps prop with only one step!

  const steps : StepModel[] = [
    {title: 'S1', end: 150, steps: []},
    {title: 'S2', end: 180, steps: []},
    {title: 'S3', end: 240, steps: []},
    {title: 'S4', end: 330, steps: []},
    {title: 'G', end: 350, steps: [{title: 'G.F', end: 335, steps: []}, {title: 'G', end: 350, steps: []}]}
  ]

  const goal = { 
    title:'G',
    start: 100, 
    end: 350,
    steps: steps,
  }

  const [mainStep, setMainStep] = useState<MainStepModel>(goal)


  // some UI controle
  const svgSize = 600
  const pathCenter = {x: 300, y: 300}
  const radius = 250
  const spaceDeg = 60
  const strokeWidth = 30
  const circlesSize = 35

  function onSelectStep(step : StepModel, prevEnd: number){
    console.log('step', step)
    if(mainStep.steps.length <= 1) throw new Error('There are no further steps!')
    else if (step.steps.length <= 0) setMainStep({title: step.title, start: prevEnd, end: step.end, steps: [{title: step.title, end: step.end, steps: []}]})
    else setMainStep({...step, start: prevEnd})
  }


  return (
    <section className='time-line'>
      <h2>Timeline</h2>
      <svg width={svgSize} height={svgSize}>
        {(() => {
          const totalDays = mainStep.end - mainStep.start
          const angleRange = 360 - spaceDeg
          let accumulated = 0

          const stepsToRender: StepModel[] = mainStep.steps

          const renderedSteps = stepsToRender.map((step, index) => {
            const prevEnd = stepsToRender[index - 1]?.end ?? mainStep.start
            const stepDays = step.end - prevEnd
            const stepAngle = (stepDays / totalDays) * angleRange
            const startAngle = spaceDeg / 2 + (accumulated / totalDays) * angleRange
            const endAngle = startAngle + stepAngle
            accumulated += stepDays

            const angleRad = (endAngle - 90) * (Math.PI / 180)
            const stepCircleX = pathCenter.x + radius * Math.cos(angleRad)
            const stepCircleY = pathCenter.y + radius * Math.sin(angleRad)

            return (
              <g key={index} onClick={()=>onSelectStep(step, prevEnd)}>
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