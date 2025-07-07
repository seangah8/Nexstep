
// defines the structure of a timeline object 
import { TimelineModel } from "../../models/timeline.models"

// define the shape of the timeline slice of the Redux state
export interface TimelineState {
    timeline : TimelineModel | null
}

// define all possible action types for the timeline state
export enum TimelineActionsType {
    SET_TIMELINE = 'SET_TIMELINE'
}

// define the structure of the SET_TIMELINE action
interface SetTimelineAction {
    type: TimelineActionsType.SET_TIMELINE
    timeline: TimelineModel
}

// Combine all timeline-related actions into a single type
export type TimelineAction = SetTimelineAction
