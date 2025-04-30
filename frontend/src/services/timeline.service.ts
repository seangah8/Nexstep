import { StepModel } from "../models/timeline.models";


export const timelineService = {
    findParentStart
}



function findParentStart(allSteps: StepModel[], parent: StepModel, createTime: number): number {
    const siblings = allSteps.filter(step => step.parentId === parent.parentId)
    const latestSiblingBefore = siblings
      .filter(step => step.end < parent.end)
      .reduce((maxEnd, step) => Math.max(maxEnd, step.end), 0)
  
    if (latestSiblingBefore !== 0) return latestSiblingBefore
  
    const grandparent = allSteps.find(step => step.id === parent.parentId)
    if (grandparent && grandparent.id !== parent.id) {
      return findParentStart(allSteps, grandparent, createTime)
    }
  
    return createTime
  }


     