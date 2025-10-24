import { timelineService } from "../../services/timeline.service"
import { StepModel } from "../../models/timeline.models"
import { colorService } from "../../services/color.service"

interface HoverModalProps{
    step : StepModel
    today : number
}

export function HoverModal({ step, today } : HoverModalProps){
    return(
        <section className="hover-modal">
            <div className="image-area" 
                style={today > step.end 
                    ? { backgroundColor: colorService.colorMain3 } 
                    : { backgroundColor: colorService.colorMain1 }
                }
            >
                <img src={step.image}/>
            </div>
            
            <h2 style={today > step.end ? {color: colorService.colorMain3} : {}}>
                {step.title}
            </h2>

            <h4 style={today > step.end ? {color: colorService.colorMain3} : {}}>
                {`
                    ${today > step.end ? 'Complited' : 'Due'} 
                    : ${timelineService.formatDateFromEnd(step.end)}
                `}
            </h4>

            <p style={today > step.end ? {color: colorService.colorMain3} : {}}>
                {step.description}
            </p>

        </section>
    )
}