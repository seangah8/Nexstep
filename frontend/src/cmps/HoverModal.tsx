import { timelineService } from "../services/timeline.service"
import { StepModel } from "../models/timeline.models"

interface HoverModalProps{
    step : StepModel
    today : number
}

export function HoverModal({ step, today } : HoverModalProps){
    return(
        <section className="hover-modal">
            <h2>{step.title}</h2>
            <h4>{step.description}</h4>
            <img src={step.image}/>
            <h4>{`
                ${today > step.end ? 'Complited' : 'Due'} 
                : ${timelineService.formatDateFromEnd(step.end)}
            `}</h4>
        </section>
    )
}