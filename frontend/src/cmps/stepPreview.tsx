import { editModalModel, MainStepModel, StepModel, draggingModal } from "../models/timeline.models"
import { timelineService } from "../services/timeline.service"
import { utilService } from "../services/util.service"


interface stepPreviewProps{
    step : StepModel
    nextStep: StepModel
    allSteps: StepModel[]
    mainStep : MainStepModel
    stepsToShow: StepModel[]
    prevEnd: number
    stepLocation: {
        angleRange: {start: number, end: number}
        circleLocation: {x: number, y: number}
    }
    today : number
    createTime : number
    svgRef : React.RefObject<SVGSVGElement | null>
    dragging : draggingModal | null
    onSetSteps: (newSteps : StepModel[]) => void
    onSetMainStep: (mainStep : MainStepModel) => void
    onSetEditModal: (newEditModal : editModalModel) => void
    onSetDragging: (newDragging : draggingModal | null) => void
    onAddingStep: (step : StepModel) => void
}

export function StepPreview({
    step, 
    nextStep,
    allSteps,
    mainStep,
    stepsToShow,  
    prevEnd, 
    stepLocation, 
    today,
    createTime,
    svgRef,
    dragging,
    onSetSteps,
    onSetMainStep,
    onSetEditModal,
    onSetDragging,


} : stepPreviewProps){

    // Load UI settings from timeline service
    const { svgCenter, radius, spaceDeg, strokeWidth, circlesSize } = timelineService.getTimelineUISettings()

    function onSelectStep(selectStep: StepModel, prevEnd: number, stepsToShow: StepModel[]) {
        console.log('selectStep', { ...selectStep, start: prevEnd })
        if (stepsToShow.length <= 1) throw new Error('There are no further steps!')
        else onSetMainStep({ ...selectStep, start: prevEnd })
    }

    function handleZoomIn(event: React.WheelEvent, selectStep: StepModel, prevEnd: number, stepsToShow: StepModel[]) {
        if (event.deltaY < 0) // User scrolled Up
            onSelectStep(selectStep, prevEnd, stepsToShow)
    }

    function handleRightDown(event: React.MouseEvent, step: StepModel){
        event.preventDefault()
        if(event.button === 2 && stepsToShow){
            if(!dragging && step.end >= today){
                onSetDragging({startPoint: {x: event.pageX, y: event.pageY}, 
                druggingStep: step, 
                onShift: event.shiftKey,
                prevStepsToSow: stepsToShow })
            } 
        }
    }

    // adding new step
    function handleRightClickOnPath(event: React.MouseEvent, nextStep: StepModel, prevEnd: number) {
        event.preventDefault()
        if(event.button === 2 && svgRef.current){
        const svgRect = svgRef.current.getBoundingClientRect()
        const svgLocation = {x: svgRect.x, y: svgRect.y}
        const Mouselocation = {x: event.pageX, y: event.pageY}
        const newStepEnd = timelineService.locationToDay(
            svgCenter, 
            svgLocation, 
            mainStep, 
            spaceDeg, 
            Mouselocation
        )

        if(newStepEnd < today) 
            throw new Error('cant add step before today date!')

        const newStep : StepModel = {
            id: utilService.createId(),
            parentId: nextStep.parentId,
            title: 'new',
            description: '',
            image: 'https://images.icon-icons.com/1558/PNG/512/353412-flag_107497.png',
            end: newStepEnd
        }
        
        const isMainEmpty = nextStep.id.slice(-5) === 'dummy'

        if(!isMainEmpty){

            // extract and orgenize next step
            let newSteps = timelineService.extractWhenCreateNewStep(
                allSteps, 
                nextStep, 
                today, 
                prevEnd, 
                createTime
            )

            // update nextStep with new start
            newSteps = timelineService.changeChildrenAndParentsEnd(
                newSteps,
                nextStep,
                prevEnd,
                nextStep.end,
                newStepEnd,
                nextStep.end,
                today,
                false, // always be flase
            )
            onSetSteps([...newSteps, newStep])
        }

        else{
            const extraStep = {
                id: utilService.createId(),
                parentId: mainStep.id,
                title: mainStep.title,
                description: mainStep.description,
                image: mainStep.image,
                end: mainStep.end
            }
            onSetSteps([...allSteps, newStep, extraStep])
        }


        onSetEditModal({ 
            step: newStep, 
            start: prevEnd, 
            nextStep: nextStep, 
            today: today, 
            createTime: createTime })
        }
    }

    function handleRightClickOnCircle(event: React.MouseEvent, step: StepModel, prevEnd: number, nextStep: StepModel) {
        event.preventDefault()
        if(event.button === 2 && step.end > today){
            onSetEditModal({ 
            step: step, 
            start: prevEnd, 
            nextStep: nextStep, 
            today: today, 
            createTime: createTime })
        }
    }

    function handleRightUpInsideStep(event: React.MouseEvent, step: StepModel, prevEnd: number, nextStep: StepModel){
        event.preventDefault()
        if(event.button === 2 && dragging){
        const distance = Math.sqrt(
            (event.clientX - dragging.startPoint.x) ** 2 + 
            (event.clientY - dragging.startPoint.y) ** 2)
        if(distance < 5)
            handleRightClickOnCircle(event, step, prevEnd, nextStep)
        }
    }

    return(
        <g
            onClick={() => onSelectStep(step, prevEnd, stepsToShow)}
            onWheel={event => handleZoomIn(event, step, prevEnd, stepsToShow)}
            >
            
            <path
                onMouseDown={event =>handleRightClickOnPath(event, step, prevEnd)}
                d={utilService.describeArc(svgCenter.x, 
                svgCenter.y, 
                radius, 
                stepLocation.angleRange.start, 
                stepLocation.angleRange.end)}

                stroke={step.end < today ? "green" : "#389BBA"}
                strokeWidth={strokeWidth}
                fill='none'
            />
            <circle
                onMouseDown={event =>handleRightDown(event, step)}
                onMouseUp={event => handleRightUpInsideStep(event, step, prevEnd, nextStep)}
                cx={stepLocation.circleLocation.x}
                cy={stepLocation.circleLocation.y}
                r={circlesSize}
                fill={step.end < today ? "green" : "#389BBA"}
                stroke="black"
                strokeWidth='2'
            />
            <text
                onMouseDown={event =>handleRightDown(event, step)}
                onMouseUp={event => handleRightUpInsideStep(event, step, prevEnd, nextStep)}
                x={stepLocation.circleLocation.x}
                y={stepLocation.circleLocation.y + 6}
                textAnchor="middle"
                fontSize="16"
                fill="white"
                fontFamily="Arial"
            >
                {step.title}
            </text>
        </g>
    )
}