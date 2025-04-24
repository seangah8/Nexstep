import { Route, HashRouter as Router, Routes } from 'react-router-dom'

import TimelinePage from "./pages/TimeLinePage.tsx"


function App() {

  return (
    <section className='app'>
      <Router>
        <Routes>
          <Route path='/' element={<TimelinePage />} />
        </Routes>
      </Router>
    </section>
  )
}

export default App
