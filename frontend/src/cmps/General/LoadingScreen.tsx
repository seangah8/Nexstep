import { useEffect, useState } from "react";
import { utilService } from "../../services/util.service";

interface LoadingScreenProps {
  howManySeconds: number
  loadingText: string
}

export function LoadingScreen({ howManySeconds, loadingText }: LoadingScreenProps) {
  const [millisecondsWaiting, setMillisecondsWaiting] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const barSpaceAngle = 40
  const barSize = 100
  const containerSize = 120
  const barXPos = containerSize / 2
  const barYPos = containerSize / 2

  const seconds = millisecondsWaiting / 1000
  const totalArc = 360 - barSpaceAngle * 2
  const progress = seconds % 1
  const direction = Math.floor(seconds) % 2 === 0 ? 1 : -1
  const localProgress = direction === 1 ? progress : 1 - progress
  const dotAngle = barSpaceAngle + localProgress * totalArc - 90
  
  const dotLocation = utilService.getCirclePoint(barSize, dotAngle, barXPos, barYPos)

  const getLoadingText = (perc: number): string => {
    let finalText = ''
    
    switch (loadingText){
      case 'paths':
        if (perc < 20) finalText = "Analyzing intent and decoding input parameters..."
        else if (perc < 38) finalText = "Mapping potential goal trajectories and strategic variants..."
        else if (perc < 57) finalText = "Evaluating feasibility and balancing success probabilities..."
        else if (perc < 70) finalText = "Synthesizing dynamic development paths using AI heuristics…"
        else if (perc < 88) finalText = "Refining results with adaptive reasoning and pattern analysis…"
        else finalText = "Finalizing insights and preparing presentation layer…"
        break

      case 'choose-path':
        if (perc < 10) finalText = "Confirming selected strategy and validating constraints…"
        else if (perc < 28) finalText = "Aligning milestones with user preferences and timeline…"
        else if (perc < 65) finalText = "Optimizing task sequence for efficiency and success impact…"
        else finalText = "Applying adaptive adjustments and finalizing your personalized path…"
        break

      case 'create-timeline':
        if (perc < 16) finalText = "Preparing your new timeline…"
        else if (perc < 39) finalText = "Setting up the structure for your goal…"
        else if (perc < 84) finalText = "Organizing your timeline layout…"
        else finalText = "Finalizing and loading your timeline…"
    }

    return finalText
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMillisecondsWaiting(prev =>  prev + 20)
    }, 20)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const totalMs = howManySeconds * 1000
    const perc = Math.min(99, Math.floor((millisecondsWaiting / totalMs) * 100));
    setPercentage(perc)
  }, [millisecondsWaiting])

  return (
    <section className="loading-screen">
      <div className="loading-circle-container">
        <h1>{percentage}%</h1>
        <div className="loading-dot" style={{top: dotLocation.y - 5, left: dotLocation.x - 5}}/>
        <div className="arc" style={{
          width: barSize + 5, 
          height: barSize + 5,
          top: (containerSize - barSize - 5) / 2,
          left: (containerSize - barSize - 5) / 2
        }}/>
      </div>
      <p className="loading-text">{getLoadingText(percentage)}</p>
    </section>
  )
}
