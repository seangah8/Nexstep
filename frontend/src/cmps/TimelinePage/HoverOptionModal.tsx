import { ReactElement } from "react"
import { OptionModal } from "../../models/timeline.models"

interface HoverOptionModalProps{
    option: OptionModal | null
}

export function HoverOptionModal({option} : HoverOptionModalProps){

    function convertStringToElement(str: string): string | ReactElement {
        const shouldConvert = str.trim().startsWith('<')
        if (!shouldConvert) return str

        return <span dangerouslySetInnerHTML={{ __html: str }} />
    }

    return(
        <section className="hover-option-modal">
            <div className="hexagon-background">
                {
                    option &&
                    <div className="context">
                        
                        <h3>{convertStringToElement(option.icon)}</h3>
                        <h4>{option.title}</h4>
                        <p>{option.description}</p>
                    </div>
                }

            </div>
        </section>
    )
}