import { EditModalModel, MainStepModel, StepModel, DraggingModel } from "../../models/timeline.models"
import { colorService } from "../../services/color.service"
import { timelineService } from "../../services/timeline.service"
import { utilService } from "../../services/util.service"


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
    dragging : DraggingModel | null
    isMentorOpen : boolean
    isStepHovered: boolean
    onSetSteps: (newSteps : StepModel[]) => void
    onSetMainStep: (mainStep : MainStepModel) => void
    onSetEditModal: (newEditModal : EditModalModel) => void
    onSetDragging: (newDragging : DraggingModel | null) => void
    onAddingStep: (step : StepModel) => void
    onSetHoveredStep: (step : StepModel | null) => void
    svgFadeOutAnimation: () => void
    svgFadeInAnimation: () => void
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
    isMentorOpen,
    isStepHovered,
    onSetSteps,
    onSetMainStep,
    onSetEditModal,
    onSetDragging,
    onSetHoveredStep,
    svgFadeOutAnimation,
    svgFadeInAnimation,

} : stepPreviewProps){

    // Load UI settings from timeline service
    const { 
        svgCenter, 
        radius, 
        spaceDeg, 
        strokeWidth, 
        circlesRadius, 
        circlesPadding, 
        fadeTimeSeconds 
    } = timelineService.getTimelineUISettings()


    const baseColor = step.end < today
        ? colorService.colorMain3
        : isMentorOpen
        ? colorService.colorMain2
        : colorService.colorMain1

    const darkColor = step.end < today
        ? colorService.colorMain3Dark1
        : isMentorOpen
        ? colorService.colorMain2Dark1
        : colorService.colorMain1Dark1

    const currentStrokeColor = isStepHovered ? darkColor : baseColor
    const currentFillColor = isStepHovered ? darkColor : baseColor

    async function onSelectStep(selectStep: StepModel, prevEnd: number, stepsToShow: StepModel[]) {
        console.log('selectStep', { ...selectStep, start: prevEnd })
        if (stepsToShow.length <= 1) throw new Error('There are no further steps!')
        else {
            svgFadeOutAnimation()
            await utilService.delay(fadeTimeSeconds*1000)
            onSetMainStep({ ...selectStep, start: prevEnd })
            svgFadeInAnimation()
        }
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
            title: 'New Step',
            description: '',
            image: '/flag_icon.png',
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
            style={{cursor:'pointer'}}
        >
            <defs>
                <clipPath id={`circleClip-${step.id}`}>
                    <circle
                    cx={stepLocation.circleLocation.x}
                    cy={stepLocation.circleLocation.y}
                    r={circlesRadius - circlesPadding}
                    />
                </clipPath>
            </defs>
            
            <path
                onMouseDown={event => handleRightClickOnPath(event, step, prevEnd)}
                onMouseEnter={() => onSetHoveredStep(step)}
                onMouseLeave={() => onSetHoveredStep(null)}
                d={utilService.describeArc(
                    svgCenter.x,
                    svgCenter.y,
                    radius,
                    stepLocation.angleRange.start,
                    stepLocation.angleRange.end
                )}
                stroke={currentStrokeColor}
                strokeWidth={isStepHovered ? strokeWidth * 1.05 : strokeWidth}
                fill="none"
                strokeLinecap="round"
                // transform={`scale(${isStepHovered ? 0.2 : 1})`}
                style={{
                    transformOrigin: `${svgCenter.x}px ${svgCenter.y}px`,
                    transition:
                        "transform 0.1s ease-out, stroke-width 0.1s ease-out, stroke 0.1s ease-out",
                }}
            />

            <g
                onMouseEnter={() => onSetHoveredStep(step)}
                onMouseLeave={() => onSetHoveredStep(null)}
                onMouseDown={event => handleRightDown(event, step)}
                onMouseUp={event => handleRightUpInsideStep(event, step, prevEnd, nextStep)}
            >
                {/* outer circle */}
                <circle
                    cx={stepLocation.circleLocation.x}
                    cy={stepLocation.circleLocation.y}
                    r={circlesRadius}
                    fill={currentFillColor}
                    stroke={darkColor}
                    strokeWidth="2"
                    transform={`scale(${isStepHovered ? 1.05 : 1})`}
                    style={{
                        transformOrigin: `${stepLocation.circleLocation.x}px ${stepLocation.circleLocation.y}px`,
                        transition:
                            "transform 0.1s ease-out, fill 0.1s ease-out, stroke 0.1s ease-out",
                    }}
                />
                {/* inner circle */}
                <circle
                    cx={stepLocation.circleLocation.x}
                    cy={stepLocation.circleLocation.y}
                    r={circlesRadius - circlesPadding}
                    fill={baseColor}
                    style={{
                        transition: "fill 0.1s ease-out",
                    }}
                />
                {/* image */}
                <image
                    href={step.image}
                    x={stepLocation.circleLocation.x - circlesRadius}
                    y={stepLocation.circleLocation.y - circlesRadius}
                    width={circlesRadius * 2}
                    height={circlesRadius * 2}
                    clipPath={`url(#circleClip-${step.id})`}
                    preserveAspectRatio="xMidYMid slice"
                    transform={`scale(${isStepHovered ? 1.05 : 1})`}
                    style={{
                        transformOrigin: `${stepLocation.circleLocation.x}px ${stepLocation.circleLocation.y}px`,
                        transition: "transform 0.1s ease-out",
                    }}
                />
            </g>
        </g>
    )
}