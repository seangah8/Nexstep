import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { utilService } from '../../services/util.service'
import { useState } from 'react'

ChartJS.register(ArcElement, Tooltip, Legend)

interface MentorSelectorsProps {
  mentorRadius: number
  iconsPathRadius: number
  iconsRadius: number
}

export function MentorSelectors({mentorRadius, iconsPathRadius, iconsRadius}: MentorSelectorsProps) {

  const svg1 = <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
     xmlns="http://www.w3.org/2000/svg">
  <g stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

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
    {id: 'id1', icon: svg1},
    {id: 'id2', icon: '2'},
    {id: 'id3', icon: svg1},
    {id: 'id4', icon: svg1},
    {id: 'id5', icon: svg1},
    {id: 'id6', icon:  <i className="fa-solid fa-bars"></i>},
    {id: 'id7', icon: svg1},
    {id: 'id8', icon: svg1},
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

  return (
    <section className="mentor-selectors">
        <div className='doughnut'>
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
