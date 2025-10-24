import { useEffect, useState } from "react"
import { timelineService } from "../../services/timeline.service"
import { MentorChat } from "./MentorChat"
import { MentorSelectors } from "./MentorSelectors"
import { AnswerModel, MainStepModel, MentorQuestionModel, OptionModel, StepModel } from "../../models/timeline.models"
import { getMentorQuestions } from "../../storage/mentorQuestions"
import { LoadingScreen } from "../General/LoadingScreen"

interface MentorProps{
    isMentorOpen: boolean
    mainStep: MainStepModel
    today: number
    setIsMentorOpen: React.Dispatch<React.SetStateAction<boolean>>
    replaceSteps: (steps : StepModel[]) => void
    setHoveredOption: (option : OptionModel | null) => void
}

export function Mentor({
    isMentorOpen, 
    mainStep,
    today,
    setIsMentorOpen, 
    replaceSteps, 
    setHoveredOption,
    
} : MentorProps){

    const { svgSize, mentorRadiusClose, selectorsRadius, iconsPathRadius, iconsRadius, chatRadiuse } = timelineService.getTimelineUISettings()
    const mentorRadius = isMentorOpen ? svgSize : mentorRadiusClose
    const [mentorQuestions, setMentorQuestions] = useState<MentorQuestionModel[]>(getMentorQuestions())
    const [question, setQuestion] = useState<string>(mentorQuestions[0].question)
    const [options, setOptions] = useState<OptionModel[]>(mentorQuestions[0].options)
    const [loadingApi, setLoadingApi] = useState<number | null>(null)

    const isMainStepFinished = mainStep.end < today

    // after each time the user pick an option
    useEffect(() => {
        const emptyAnswerIndex = mentorQuestions.findIndex(q => q.answer === null)

        // there are still quations that havent been answered
        if (emptyAnswerIndex !== -1){
            setQuestion(mentorQuestions[emptyAnswerIndex].question)
            // if its any normal question
            if(emptyAnswerIndex < mentorQuestions.length-1)
                setOptions(mentorQuestions[emptyAnswerIndex].options)
            // last question - pick a path
            else insertPathsOptions()
        }

        // when all questions have been answered
        else {
            let newSteps = mentorQuestions[mentorQuestions.length - 1].answer
            // check the answer indeed an array (steps)
            if(Array.isArray(newSteps))
                onChoosingPath(newSteps)
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
        isMainStepFinished 
            ? setIsMentorOpen(false)
            : setIsMentorOpen(prev=>!prev)
        clearAnswers()
    }

    async function insertPathsOptions(){
        const startDay = Math.max(mainStep.start, today)
        const totalDays = mainStep.end - startDay

        const answers = mentorQuestions.reduce((acc, q) => {
            if (typeof q.answer === 'string') {
                acc[q.key] = {
                    label: q.options.find(opt => opt.value === q.answer)?.title || '',
                    value: q.answer,
                    meaning: q.meaning
                }
            }
            return acc
        }, {} as Record<string, AnswerModel>)

        setLoadingApi(90)
        const paths = await timelineService
            .getPathsFromOpenAI(answers, totalDays, startDay, mainStep)
        // setLoadingApi(null)
        setOptions(paths)
    }

    async function onChoosingPath(steps : StepModel[]){
        setLoadingApi(20)
        const stepsWithImages = await timelineService.addImagesFromOpenAI(steps)
        setLoadingApi(null)
        replaceSteps(stepsWithImages)
        setIsMentorOpen(false)
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
                isMainStepFinished={isMainStepFinished}
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

            {   loadingApi &&
                <LoadingScreen
                    howManySeconds={loadingApi}
                />
            }


        </section>
    )
}