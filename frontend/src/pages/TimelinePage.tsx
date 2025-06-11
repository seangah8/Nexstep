import { Timeline } from "../cmps/TimelinePage/Timeline.tsx"

export function TimelinePage() {

    return (
      <section className='time-line-page'  onContextMenu={e => e.preventDefault()}>
        <Timeline/>
      </section>
    )
  }

  