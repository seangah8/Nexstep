
interface MentorChatProps{
    mentorRadius: number
    chatRadiuse: number
    toggleSelectors: () => void
}

export function MentorChat({mentorRadius, chatRadiuse, toggleSelectors} : MentorChatProps){

    return(
        <section className="mentor-chat" 
        onClick={()=>toggleSelectors()}
            style={{
                width: chatRadiuse,
                height: chatRadiuse,
                top: (mentorRadius - chatRadiuse) /2,
                left: (mentorRadius - chatRadiuse) /2,
            }}
        >

            
        </section>
    )
}