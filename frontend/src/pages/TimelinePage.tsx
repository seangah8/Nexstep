import { Timeline } from "../cmps/TimelinePage/Timeline.tsx"
import { RootState } from "../store/store.ts"
import { useSelector } from "react-redux"
import { TimelineModel } from "../models/timeline.models.ts"
import { timelineService } from "../services/timeline.service.ts"
import { timelineActions } from "../store/actions/timeline.actions.ts"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function TimelinePage() {

  const navigate = useNavigate()

  const loggedInUser = useSelector((storeState: RootState) => 
    storeState.userModule.loggedInUser)

  const timeline = useSelector((storeState: RootState) => 
    storeState.timelineModule.timeline)

  useEffect(()=>{
    if(loggedInUser)
      loadTimeline()
  },[])

  async function loadTimeline(){
    if(loggedInUser){
      const timeline : TimelineModel | null = 
        await timelineService.get(loggedInUser._id)
      if(!timeline) navigate('/welcome')
      else timelineActions.saveTimeline(timeline)
    }
  }

  if(!loggedInUser) return (
    <div className="login-first-container">
      <h3>Login First</h3>
    </div>
  )

  if(!timeline) return <h3>Loading...</h3>

  return (
    <section className='timeline-page'  onContextMenu={e => e.preventDefault()}>
      <Timeline timeline={timeline}/>
    </section>
  )
}

  