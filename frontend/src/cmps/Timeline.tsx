import { utilService } from "../services/util.service"
import { useState } from "react";
import { StepModel, MainStepModel, editModalModel } from "../models/timeline.models";
import { timelineService } from "../services/timeline.service";
import { EditStepModal } from "./EditStepModal";

function Timeline() {



  const [steps, setSteps] = useState<StepModel[]>(
    [
      { id: 'idUserGoal', title:'Users Goal', parentId: null, end: 350},
      {id: 'idS1', parentId: 'idUserGoal', title: 'S1', end: 150},
      {id: 'idS1.S1' ,parentId: 'idS1', title: 'S1.S1', end: 105},
      {id: 'idS1.S2' ,parentId: 'idS1', title: 'S1.S2', end: 115},
      {id: 'idS1.N2' ,parentId: 'idS1', title: 'S1', end: 150},
      {id: 'idS2' ,parentId: 'idUserGoal', title: 'S2', end: 180},
      {id: 'idS3' ,parentId: 'idUserGoal', title: 'S3', end: 240},
      {id: 'idS4' ,parentId: 'idUserGoal', title: 'S4', end: 330},
      {id: 'idG' ,parentId: 'idUserGoal', title: 'G', end: 350},
      {id: 'idG.F' ,parentId: 'idG', title: 'G.S1', end: 335},
      {id: 'idG.G' ,parentId: 'idG', title: 'G', end: 350}
    ]
  ) 

  const createTime = 100


  const [mainStep, setMainStep] = useState<MainStepModel>({...steps[0], start: createTime})
  const [editModal, setEditModal] = useState<editModalModel | null>(null)

  // some UI controle
  const svgSize = 600
  const pathCenter = {x: 300, y: 300}
  const radius = 250
  const spaceDeg = 60
  const strokeWidth = 30
  const circlesSize = 35

  function onUpdateSteps(newSteps : StepModel[], postEnd: number) : void{
    setSteps(newSteps)

    //updateing the main step as well for counter conflicts
    const updatedMainStep = newSteps.find(step=> mainStep.id === step.id)
    if(updatedMainStep)
      setMainStep({...updatedMainStep, end: postEnd, start: mainStep.start})
  }

  function onUpdateEditModal(newEditModal : editModalModel | null) : void{
    setEditModal(newEditModal)
  }
  

  function onSelectStep(selectStep : StepModel, prevEnd: number, stepsToShow : StepModel[]){
    console.log('selectStep', {...selectStep, start: prevEnd})
    if(stepsToShow.length <= 1) throw new Error('There are no further steps!')
    else setMainStep({...selectStep, start: prevEnd})
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

  function handleZoomIn(event: React.WheelEvent, selectStep : StepModel, prevEnd: number, stepsToShow: StepModel[]) {
    if (event.deltaY < 0) { // User scrolled Up
      onSelectStep(selectStep, prevEnd, stepsToShow)
    }
  }

  function handleRightClick(event: React.MouseEvent, step: StepModel, prevEnd: number, nextStep: StepModel) {
    event.preventDefault()
    setEditModal({step: step, start: prevEnd, nextStep: nextStep})
  }




  return (
    <section className='time-line' onWheel={handleZoomOut}>
      <h2>Timeline</h2>
      <svg width={svgSize} height={svgSize}>
        {(() => {
          const totalDays = mainStep.end - mainStep.start
          const angleRange = 360 - spaceDeg
          let accumulated = 0

          const stepsToShow: StepModel[] = steps.filter(step=>step.parentId === mainStep.id)
          if(stepsToShow.length <= 0) {
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
                onClick={()=>onSelectStep(step, prevEnd, stepsToShow)} 
                onWheel={event=>handleZoomIn(event,step, prevEnd, stepsToShow)}
                onContextMenu={event=>handleRightClick(event,step,prevEnd, nextStep)}>
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
      
      {
        editModal && <EditStepModal editModal={editModal} 
        allSteps={steps}
        onUpdateSteps={onUpdateSteps} 
        onUpdateEditModal={onUpdateEditModal}/>
      }

    </section>
  )
}
  
export default Timeline