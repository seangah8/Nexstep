import { useEffect, useState } from "react"
import { timelineService } from "../../services/timeline.service"
import { MentorChat } from "./MentorChat"
import { MentorSelectors } from "./MentorSelectors"
import { MentorQuestionModal, OptionModal, StepModel } from "../../models/timeline.models"

interface MentorProps{
    isMentorOpen: boolean
    setIsMentorOpen: React.Dispatch<React.SetStateAction<boolean>>
    replaceSteps: (steps : StepModel[]) => void
    setHoveredOption: (option : OptionModal | null) => void
}

export function Mentor({
    isMentorOpen, 
    setIsMentorOpen, 
    replaceSteps, 
    setHoveredOption
} : MentorProps){


    const { svgSize, mentorRadiusClose, selectorsRadius, iconsPathRadius, iconsRadius, chatRadiuse } = timelineService.getTimelineUISettings()
    const mentorRadius = isMentorOpen ? svgSize : mentorRadiusClose
    const [mentorQuestions, setMentorQuestions] = useState<MentorQuestionModal[]>(timelineService.getMentorQuestions)
    const [question, setQuestion] = useState<string>(mentorQuestions[0].question)
    const [options, setOptions] = useState<OptionModal[]>(mentorQuestions[0].options)


    // after each time the user pick an option
    useEffect(() => {
        const emptyAnswerIndex = mentorQuestions.findIndex(q => q.answer === null)

        // there are still quations that havent been answered
        if (emptyAnswerIndex !== -1){
            setQuestion(mentorQuestions[emptyAnswerIndex].question)
            setOptions(mentorQuestions[emptyAnswerIndex].options)
        }

        // when all questions have been answered
        else  {
            let newSteps = mentorQuestions[mentorQuestions.length - 1].answer
            // check the answer indeed an array (steps)
            if(Array.isArray(newSteps)){
                replaceSteps(newSteps)
                setIsMentorOpen(false)
            }
        }

    }, [mentorQuestions])

    function onClickOption(answer : string | StepModel[]){
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
                    setHoveredOption={setHoveredOption}
                />
            }

        </section>
    )
}