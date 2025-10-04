import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { utilService } from '../../services/util.service'
import { useEffect, useState } from 'react'

ChartJS.register(ArcElement, Tooltip, Legend)

interface MentorSelectorsProps {
  mentorRadius: number
  selectorsRadius: number
  iconsPathRadius: number
  iconsRadius: number
}

export function MentorSelectors({mentorRadius, selectorsRadius, iconsPathRadius, iconsRadius}: MentorSelectorsProps) {

  // temporary
  const svg1 = <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
     xmlns="http://www.w3.org/2000/svg">
  <g stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">

    <line x1="2" y1="9" x2="7" y2="9"/>
    <line x1="1" y1="12" x2="7" y2="12"/>
    <line x1="3" y1="15" x2="7" y2="15"/>

    <circle cx="14" cy="12" r="8"/>

    <ellipse cx="14" cy="12" rx="3" ry="8"/>

    <path d="M6.5 9.5 Q14 7 21.5 9.5"/>
    <path d="M6.5 14.5 Q14 17 21.5 14.5"/>
  </g>
</svg>



  const data = [
    {icon: '1-3'},
    {icon: '4-6'},
    {icon: '7-10'},
    {icon: '11-15'},
    {icon: '15-20'},
    {icon: '20-30'},
    {icon: '30-40'},
    {icon: '40+'},
  ]

  const doughnuData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'My First Dataset',
        data: Array(data.length).fill(1),
        backgroundColor: '#006769',     
        hoverBackgroundColor: '#00393a',
        hoverOffset: 30,
        borderWidth: 5,
        borderColor: '#fbd9bd',
        hoverBorderColor: '#fbd9bd',
      },
    ],
  }

  const [hoverdSelectorIndex, setHoveredSelectorIndex] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)



  useEffect(() => {
    revealIcons()
  }, [data.length])

  // reveal icons one by one
  async function revealIcons() {
    const startDelay = 400 
    const interval = 100

    await utilService.sleep(startDelay)

    for (let i = 0; i < data.length; i++) {
      setVisibleCount(i + 1)
      await utilService.sleep(interval)
    }
  }

  return (
    <section className="mentor-selectors">
        <div className='doughnut' 
          style={{
            width: selectorsRadius, 
            height: selectorsRadius,
            position: 'relative',
            top: (mentorRadius - selectorsRadius) / 2,
            left: (mentorRadius - selectorsRadius) / 2,
          }}
        >
            <Doughnut 
                data={doughnuData} 
                options={{
                    layout: {
                        padding: 30,
                    },
                    cutout: '43%',
                    plugins:{
                        tooltip: { enabled: false },
                        legend: { display: false },
                    },
                    onHover: (event, elements) => {
                      const target = event.native?.target as HTMLCanvasElement | undefined;
                      if (!target) return;

                      if (elements.length) {
                        target.style.cursor = 'pointer'
                        const index = elements[0].index
                        setHoveredSelectorIndex(index)
                      } else {
                        target.style.cursor = 'default'
                        setHoveredSelectorIndex(null)
                      }
                    },
                }}
            />
        </div>

        {
          data.map((dt, index) => {
            const angle = -90 + (360 / data.length) * (index + 0.5);
            const position = utilService.getCirclePoint(
              iconsPathRadius,
              angle,
              mentorRadius / 2 - iconsRadius,
              mentorRadius / 2 - iconsRadius,
            )
            const isVisible = index < visibleCount

            return (
              <div
                key={index}
                className="select-icon"
                style={{
                  width: iconsRadius * 2,
                  height: iconsRadius * 2,
                  position: "absolute",
                  top: position.y,
                  left: position.x,
                  transform:
                    hoverdSelectorIndex === index
                      ? `translate(${utilService.getPointByAngle(angle, 10).x}px, ${utilService.getPointByAngle(angle, 10).y}px)`
                      : "translate(0, 0)",
                  opacity: isVisible ? 1 : 0,
                }}
              >
                {dt.icon}
              </div>
            )
          })
        }

    </section>
  )
}
