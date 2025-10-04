import { timelineService } from "../../services/timeline.service"
import { MentorChat } from "./MentorChat"
import { MentorSelectors } from "./MentorSelectors"

interface MentorProps{
    isMentorOpen: boolean
    setIsMentorOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Mentor({isMentorOpen, setIsMentorOpen} : MentorProps){

    const { svgSize, mentorRadiusClose, selectorsRadius, iconsPathRadius, iconsRadius, chatRadiuse } = timelineService.getTimelineUISettings()
    const mentorRadius = isMentorOpen ? svgSize : mentorRadiusClose

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
                isMentorOpen={isMentorOpen}
                mentorRadius={mentorRadius}
                chatRadiuse={chatRadiuse}
                toggleSelectors={()=>setIsMentorOpen(prev=>!prev)}
            />

            { 
                isMentorOpen &&
                <MentorSelectors
                    mentorRadius={mentorRadius}
                    selectorsRadius={selectorsRadius}
                    iconsPathRadius={iconsPathRadius}
                    iconsRadius={iconsRadius}
                />
            }

        
        
        </section>
    )
}