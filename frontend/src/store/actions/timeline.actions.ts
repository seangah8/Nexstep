import { store } from "../store"
import { TimelineModel } from "../../models/timeline.models"
import { TimelineActionsType,  } from "../interfaces/timeline.store"
import { timelineService } from "../../services/timeline.service"

export const timelineActions = {
    createTimeline,
    saveTimeline,
}


async function createTimeline() : Promise<void> {
    try {
        const timeline = await timelineService.add()
        store.dispatch({
            type: TimelineActionsType.SET_TIMELINE,
            timeline
        })
    } catch (err) {
        console.log('Could not create timeline', err)
        throw err
    }
}

function saveTimeline(timeline: TimelineModel) : void {
    try {
        timelineService.update(timeline)
        store.dispatch({
            type: TimelineActionsType.SET_TIMELINE,
            timeline
        })
    } catch (err) {
        console.log('Cannot save timeline', err)
        throw err
    }
}