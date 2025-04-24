import { utilService } from "../services/util.service"

function Timeline() {

    const steps : {title: string; end: number;}[] = [
      {title: 'S1', end: 150},
      {title: 'S2', end: 180},
      {title: 'S3', end: 240},
      {title: 'S4', end: 330}
    ]

    const goal = {title: 'G', 
        start: 100, 
        end: 350, 
        steps: steps }

    
    const svgSize = 800
    const pathCenter = {x: 400, y: 300}
    const radius = 300
    const spaceDeg = 60
    const strokeWidth = 30
    const circlesSize = 30


    return (
      <section className='time-line'>
        <h2>Timeline</h2>
        <svg width={svgSize} height={svgSize}>
          {(() => {
            const totalDays = goal.end - goal.start
            const angleRange = 360 - spaceDeg
            let accumulated = 0

            const stepsToRender = [...goal.steps, { title: goal.title, end: goal.end }]

            const renderedSteps = stepsToRender.map((step, index) => {
              const prevEnd = stepsToRender[index - 1]?.end ?? goal.start
              const stepDays = step.end - prevEnd
              const stepAngle = (stepDays / totalDays) * angleRange
              const startAngle = spaceDeg / 2 + (accumulated / totalDays) * angleRange
              const endAngle = startAngle + stepAngle
              accumulated += stepDays

              const angleRad = (endAngle - 90) * (Math.PI / 180)
              const stepCircleX = pathCenter.x + radius * Math.cos(angleRad)
              const stepCircleY = pathCenter.y + radius * Math.sin(angleRad)

              return (
                <g key={index}>
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