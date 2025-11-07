import parse from 'html-react-parser'
import { ReactNode } from "react"
import { MainStepModel, OptionModel } from "../../models/timeline.models"

interface HoverOptionModalProps{
    option: OptionModel | null
    mainStep: MainStepModel
    today: number
}

export function HoverOptionModal({option, mainStep, today} : HoverOptionModalProps){

    const startDay = Math.max(mainStep.start, today)
    const totalDays = mainStep.end - startDay

    function convertStringToElement(str: string): string | ReactNode {
        const shouldConvert = str.trim().startsWith('<')
        if (!shouldConvert) return str
        return parse(str)
    }

    return(
        <section className="hover-option-modal">

            {
                // when the user choosing regular option
                option && !Array.isArray(option.value) &&
                <div className="hexagon-background">
                    {
                        option && (
                            <div className="context">
                                <h3>{convertStringToElement(option.icon)}</h3>
                                <h4>{option.title}</h4>
                                <p>{option.description}</p>
                            </div>
                        )
                    }
                </div>
            }

            {
                // when the user choosing a path
                option && Array.isArray(option.value) &&
                <div className="poll-background">
                    <div className="transition-background-left"/>
                    <div className="contaxt">

                        <div className="path-text">
                            <div className="icon-background">
                                {convertStringToElement(option.icon)}
                            </div>
                            <h4>{option.title}</h4>
                            <p>{option.description}</p>
                        </div>

                        <div className="path-timeline">
                            <div className="vertical-line"/>
                            <div className="start-point">
                                <i className="fa-solid fa-circle-dot"></i>
                                {startDay === today && <p>now</p>}
                            </div>
                            
                            <ul>
                                {option.value.map(step => {
                                    const precantage = 91 * ((step.end - startDay) / totalDays) + 3
                                    return(
                                    <div key={step.id} className="step" style={{top: `${precantage}%`}}>
                                        <i className="fa-solid fa-circle"></i>
                                        <li key={step.id}>
                                            {step.title}
                                        </li>
                                    </div>
                                )})}
                            </ul>
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                        
                    </div>
                    <div className="transition-background-right"/>
                </div>
            }
            

                                 
            {/* when the user choosing a path*/}

        </section>
    )
}