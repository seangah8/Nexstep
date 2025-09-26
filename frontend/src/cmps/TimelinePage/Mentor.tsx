import { useState } from "react"
import { timelineService } from "../../services/timeline.service"
import { MentorChat } from "./MentorChat"
import { MentorSelectors } from "./MentorSelectors"

interface MentorProps{
    svgSize: number
}

export function Mentor({svgSize} : MentorProps){

    const { mentorRadius, iconsPathRadius, iconsRadius, chatRadiuse } = timelineService.getTimelineUISettings()
    const [openSelectors, setOpenSelectors] = useState<boolean>(false)

    return(
        <section className="mentor" 
            style={{
                width: mentorRadius,
                height: mentorRadius,
                top: (svgSize - mentorRadius) /2,
                left: (svgSize - mentorRadius) /2,
            }}
        >

            <MentorChat
                mentorRadius={mentorRadius}
                chatRadiuse={chatRadiuse}
                toggleSelectors={()=>setOpenSelectors(prev=>!prev)}
            />

            { 
                openSelectors &&
                <MentorSelectors
                    mentorRadius={mentorRadius}
                    iconsPathRadius={iconsPathRadius}
                    iconsRadius={iconsRadius}
                />
            }

        
        
        </section>
    )
}