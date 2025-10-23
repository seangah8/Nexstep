import { useEffect, useState } from "react";
import { utilService } from "../../services/util.service";

interface LoadingScreenProps {
  howManySeconds: number;
}

export function LoadingScreen({ howManySeconds }: LoadingScreenProps) {
  const [millisecondsWaiting, setMillisecondsWaiting] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const barSpaceAngle = 40
  const barXPos = window.innerWidth / 2
  const barYPos = window.innerHeight / 2
  const barSize = 100
  const dotAngle = barSpaceAngle + (percentage / 100) * (360 - barSpaceAngle*2) - 90
  const dotLocation = utilService.getCirclePoint(barSize, dotAngle, barXPos, barYPos)

  useEffect(() => {

    const totalMs = howManySeconds * 1000
    const interval = setInterval(() => {
      setMillisecondsWaiting((prev) => {
        const next = prev + 100;
        if (next >= totalMs) {
          clearInterval(interval)
          return totalMs
        }
        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const totalMs = howManySeconds * 1000
    const perc = Math.min(99, Math.floor((millisecondsWaiting / totalMs) * 100))
    setPercentage(perc)
  }, [millisecondsWaiting])

  return (
    <section className="loading-circle">
      <h1>{percentage}%</h1>
      <div className="loading-dot" style={{top: dotLocation.y - 5, left: dotLocation.x - 5}}/>
      <div className="arc" style={{width: barSize + 5, height: barSize + 5}}/>
    </section>
  )
}
