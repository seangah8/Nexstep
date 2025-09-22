import { timelineService } from "../../services/timeline.service"
import { StepModel } from "../../models/timeline.models"

interface HoverModalProps{
    step : StepModel
    today : number
}

export function HoverModal({ step, today } : HoverModalProps){
    return(
        <section className="hover-modal">
            <div className="image-area" 
                style={today > step.end 
                    ? { backgroundColor: '#c69a3c' } 
                    : { backgroundColor: '#006769' }
                }
            >
                <img src={step.image}/>
            </div>
            
            <h2 style={today > step.end ? {color: '#c69a3c'} : {}}>
                {step.title}
            </h2>

            <h4 style={today > step.end ? {color: '#c69a3c'} : {}}>
                {`
                    ${today > step.end ? 'Complited' : 'Due'} 
                    : ${timelineService.formatDateFromEnd(step.end)}
                `}
            </h4>

            <p style={today > step.end ? {color: '#c69a3c'} : {}}>
                {step.description}
            </p>

        </section>
    )
}