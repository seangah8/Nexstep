import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface MentorSelectorsProps {

}

export function MentorSelectors({}: MentorSelectorsProps) {

  const data = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 20,
        borderWidth: 0,
      },
    ],
  }

  return (
    <section className="mentor-selectors">
        <div className='doughnut'>
            <Doughnut 
                data={data} 
                options={{
                    layout: {
                        padding: 30,
                    },
                    cutout: '45%',
                    plugins:{
                        legend:{
                            display: false
                        }
                    }
                }}
            />
        </div>

    </section>
  )
}
