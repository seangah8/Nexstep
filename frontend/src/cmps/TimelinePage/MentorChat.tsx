
interface MentorChatProps{
    mentorRadius: number
    chatRadiuse: number
}

export function MentorChat({mentorRadius, chatRadiuse} : MentorChatProps){

    return(
        <section className="mentor-chat" 
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