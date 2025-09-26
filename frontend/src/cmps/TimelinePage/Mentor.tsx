import { timelineService } from "../../services/timeline.service"
import { MentorChat } from "./MentorChat"
import { MentorSelectors } from "./MentorSelectors"

interface MentorProps{
    svgSize: number
}

export function Mentor({svgSize} : MentorProps){

    const { mentorRadius, iconsPathRadius, iconsRadius, chatRadiuse } = timelineService.getTimelineUISettings()

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
            />

            <MentorSelectors
                mentorRadius={mentorRadius}
                iconsPathRadius={iconsPathRadius}
                iconsRadius={iconsRadius}
            />
        
        
        </section>
    )
}