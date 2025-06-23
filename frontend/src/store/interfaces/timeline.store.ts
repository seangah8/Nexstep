
// defines the structure of a user object 
import { StepModel } from "../../models/timeline.models"

// define the shape of the user slice of the Redux state
export interface TimelineState {
    steps: StepModel[]
}

// define all possible action types for the user state
export enum TimelineActionsType {
    SET_TIMELINE_STEPS = 'SET_TIMELINE_STEPS'
}

// define the structure of the CHANGE_USERNAME action
interface SetTimelineStepsAction {
    type: TimelineActionsType.SET_TIMELINE_STEPS
    steps: StepModel[]
}

// Combine all user-related actions into a single type
export type TimelineAction = SetTimelineStepsAction
