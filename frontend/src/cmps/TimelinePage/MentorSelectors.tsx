import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { utilService } from '../../services/util.service'

ChartJS.register(ArcElement, Tooltip, Legend)

interface MentorSelectorsProps {
  mentorRadius: number
  iconsPathRadius: number
  iconsRadius: number
}

export function MentorSelectors({mentorRadius, iconsPathRadius, iconsRadius}: MentorSelectorsProps) {

  const data = [
    {letter: '1'},
    {letter: '2'},
    {letter: '3'},
    {letter: '4'},
    {letter: '5'},
    {letter: '6'},
    {letter: '7'},
    {letter: '8'},
  ]

  const doughnuData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'My First Dataset',
        data: Array(data.length).fill(1),
        backgroundColor: '#006769',     // all arcs
        hoverBackgroundColor: '#015152', // all arcs on hover
        hoverOffset: 30,
        borderWidth: 5,
        borderColor: '#fbd9bd',
        hoverBorderColor: '#fbd9bd',
      },
    ],
  }

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
                        target.style.cursor = 'pointer';
                      } else {
                        target.style.cursor = 'default';
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
                  backgroundColor: 'white',
                }}
              >
                {dt.letter}
              </div>
            )
          })
        }

    </section>
  )
}
