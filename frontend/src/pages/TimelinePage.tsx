import { Timeline } from "../cmps/TimelinePage/Timeline.tsx"
import { RootState } from "../store/store.ts"
import { useSelector } from "react-redux"

export function TimelinePage() {

  const user = useSelector((storeState : RootState) => 
    storeState.userModule.loggedInUser)

    return (
      <section className='time-line-page'  onContextMenu={e => e.preventDefault()}>
        <h3>{`${user?.username}'s TimeLine: `}</h3>
        <Timeline/>
      </section>
    )
  }

  