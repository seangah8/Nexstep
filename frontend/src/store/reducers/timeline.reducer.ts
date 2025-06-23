
import { TimelineAction, TimelineActionsType, TimelineState } from "../interfaces/timeline.store.ts"
import { timelineService } from "../../services/timeline.service.ts"

const initialState: TimelineState = {
    steps: timelineService.getDefultStepsDatabase(),
}

export function timelineReducer(state = initialState, cmd = {} as TimelineAction): TimelineState {
    switch (cmd.type) {

        case TimelineActionsType.SET_TIMELINE_STEPS:
            return {
                ...state,
                steps: cmd.steps
            }      
       
        default:
            return state
    }
}