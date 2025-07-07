
import { TimelineAction, TimelineActionsType, TimelineState } from "../interfaces/timeline.store.ts"

const initialState: TimelineState = {
    timeline: null
}

export function timelineReducer(state = initialState, cmd = {} as TimelineAction): TimelineState {
    switch (cmd.type) {

        case TimelineActionsType.SET_TIMELINE:
            return {
                ...state,
                timeline: cmd.timeline
            }      

        default:
            return state
    }
}