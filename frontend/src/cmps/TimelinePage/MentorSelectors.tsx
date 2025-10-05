import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { utilService } from '../../services/util.service'
import { useEffect, useState } from 'react'
import { OptionModal } from '../../models/timeline.models'

ChartJS.register(ArcElement, Tooltip, Legend)

interface MentorSelectorsProps {
  mentorRadius: number
  selectorsRadius: number
  iconsPathRadius: number
  iconsRadius: number
  options: OptionModal[]
  onClickOption: (answer : string) => void
}

export function MentorSelectors({
  mentorRadius, 
  selectorsRadius, 
  iconsPathRadius, 
  iconsRadius,
  options,
  onClickOption,

}: MentorSelectorsProps) {


  const doughnuData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'My First Dataset',
        data: Array(options.length).fill(1),
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
  const [showIcons, setShowIcons] = useState<boolean>(false)


  useEffect(() => {

    revealIcons()
  }, [options])

  // reveal icons one by one
  async function revealIcons() {
    const startDelay = 400 
    const interval = 100

    setShowIcons(false)
    await utilService.sleep(startDelay)
    setShowIcons(true)

    for (let i = 0; i < options.length; i++) {
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

                    onClick: ( _ , elements) => {
                      if (elements.length > 0) {
                        const optionIndex = elements[0].index
                        const chosenOption = options[optionIndex]
                        onClickOption(chosenOption.value)
                      }
                    },
                }}
            />
        </div>

        {
          showIcons &&
          options.map((dt, index) => {
            const angle = -90 + (360 / options.length) * (index + 0.5);
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
