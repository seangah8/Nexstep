
interface MentorChatProps{
    isMentorOpen: boolean
    mentorRadius: number
    chatRadiuse: number
    toggleSelectors: () => void
}

export function MentorChat({isMentorOpen, mentorRadius, chatRadiuse, toggleSelectors} : MentorChatProps){

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

            <div className="text-area" style={isMentorOpen ? {fontSize: '1rem'} : {fontSize: '1.8rem'}}>
                {
                    isMentorOpen 
                    ? <p>How many <span>hours per week</span> are you willing to work on this goal?</p>
                    : <i className="fa-solid fa-leaf"></i>
                }
                
            </div>
            
        </section>
    )
}