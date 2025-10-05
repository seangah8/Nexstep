import { useEffect, useState } from "react"
import { timelineService } from "../../services/timeline.service"
import { MentorChat } from "./MentorChat"
import { MentorSelectors } from "./MentorSelectors"
import { MentorQuestionModal, OptionModal } from "../../models/timeline.models"

interface MentorProps{
    isMentorOpen: boolean
    setIsMentorOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Mentor({isMentorOpen, setIsMentorOpen} : MentorProps){


    const { svgSize, mentorRadiusClose, selectorsRadius, iconsPathRadius, iconsRadius, chatRadiuse } = timelineService.getTimelineUISettings()
    const mentorRadius = isMentorOpen ? svgSize : mentorRadiusClose
    const [mentorQuestions, setMentorQuestions] = useState<MentorQuestionModal[]>(timelineService.getMentorQuestions)
    const [question, setQuestion] = useState<string>(mentorQuestions[0].question)
    const [options, setOptions] = useState<OptionModal[]>(mentorQuestions[0].options)


    useEffect(() => {
        const emptyAnswerIndex = mentorQuestions.findIndex(q => q.answer === null)
        if (emptyAnswerIndex === -1) return
        setQuestion(mentorQuestions[emptyAnswerIndex].question)
        setOptions(mentorQuestions[emptyAnswerIndex].options)
    }, [mentorQuestions])

    function onClickOption(answer : string){
        const emptyAnswerIndex = mentorQuestions.findIndex(q => q.answer === null)
        setMentorQuestions(prev =>
            prev.map((q, i) => i === emptyAnswerIndex ? { ...q, answer } : q)
        )
    }

    function clearAnswers(){
        setMentorQuestions(prev =>
            prev.map(q => ({ ...q, answer: null }))
        )
    }

    function toggleSelectors(){
        setIsMentorOpen(prev=>!prev)
        clearAnswers()
    }


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
                question={question}
                toggleSelectors={toggleSelectors}
            />

            { 
                isMentorOpen &&
                <MentorSelectors
                    mentorRadius={mentorRadius}
                    selectorsRadius={selectorsRadius}
                    iconsPathRadius={iconsPathRadius}
                    iconsRadius={iconsRadius}
                    options={options}
                    onClickOption={onClickOption}
                />
            }

        </section>
    )
}