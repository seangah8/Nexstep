import Timeline from "../cmps/Timeline.tsx"

function TimelinePage() {

    return (
      <section className='time-line-page'  onContextMenu={e => e.preventDefault()}>
        <Timeline/>
      </section>
    )
  }
  
  export default TimelinePage
  