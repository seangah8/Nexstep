import { store } from "../store"
import { StepModel } from "../../models/timeline.models"
import { TimelineActionsType,  } from "../interfaces/timeline.store"

export const timelineActions = {
    saveSteps,
}


function saveSteps(steps: StepModel[]) : void {
    try {
        // *** // do it in backend
        store.dispatch({
            type: TimelineActionsType.SET_TIMELINE_STEPS,
            steps
        })
    } catch (err) {
        console.log('Cannot save steps', err)
        throw err
    }
}