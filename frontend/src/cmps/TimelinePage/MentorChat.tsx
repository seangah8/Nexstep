import { ReactElement } from 'react'

interface MentorChatProps{
    isMentorOpen: boolean
    mentorRadius: number
    chatRadiuse: number
    question: string
    toggleSelectors: () => void
}

export function MentorChat({
    isMentorOpen, 
    mentorRadius, 
    chatRadiuse, 
    question,
    toggleSelectors

} : MentorChatProps){

    function textToReactElement(text: string): ReactElement {
        // Regular expression to find *...* parts
        const parts = text.split(/(\*.*?\*)/g)

        return (
            <p>
                {parts.map((part, i) => {
                    // If the part is surrounded by *...*, wrap it in a span
                    if (part.startsWith('*') && part.endsWith('*')) {
                    const innerText = part.slice(1, -1) // remove the asterisks
                    return <span key={i}>{innerText}</span>
                    }
                    // Otherwise, return it as plain text
                    return part
                })}
            </p>
        )
    }


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
                    ? textToReactElement(question)
                    : <i className="fa-solid fa-leaf"></i>
                }
                
            </div>
            
        </section>
    )
}