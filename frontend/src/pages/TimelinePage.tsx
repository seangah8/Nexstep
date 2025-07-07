import { Timeline } from "../cmps/TimelinePage/Timeline.tsx"
import { RootState } from "../store/store.ts"
import { useSelector } from "react-redux"
import { TimelineModel } from "../models/timeline.models.ts"
import { timelineService } from "../services/timeline.service.ts"
import { timelineActions } from "../store/actions/timeline.actions.ts"
import { useEffect } from "react"

export function TimelinePage() {

  const loggedInUser = useSelector((storeState: RootState) => 
    storeState.userModule.loggedInUser)

  const timeline = useSelector((storeState: RootState) => 
    storeState.timelineModule.timeline)

  useEffect(()=>{
    if(loggedInUser && !timeline)
      loadTimeline()
  },[])

  async function loadTimeline(){
    if(loggedInUser){
      const timeline : TimelineModel = 
        await timelineService.get(loggedInUser._id)
      timelineActions.saveTimeline(timeline)
    }
  }

  if(!loggedInUser) return <h3>Login First</h3>
  if(!timeline) return <h3>Loading...</h3>

  return (
    <section className='time-line-page'  onContextMenu={e => e.preventDefault()}>
      <h3>{`${loggedInUser.username}'s TimeLine: `}</h3>
      <Timeline timeline={timeline}/>
    </section>
  )
}

  