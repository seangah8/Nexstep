import { Route, HashRouter as Router, Routes } from 'react-router-dom'

import { Menu } from './cmps/General/Menu'
import { Provider } from 'react-redux'
import { store } from './store/store'

import { TimelinePage } from "./pages/TimelinePage"
import { UserPage } from "./pages/UserPage"


function App() {

  return (
    <section className='app'>
      <Provider store={store}>
        <Router>
          <Menu/>
          <Routes>
            <Route path='/' element={<TimelinePage />} />
            <Route path='/timeline' element={<TimelinePage />} />
            <Route path='/user' element={<UserPage />} />
          </Routes>
        </Router>
      </Provider>
    </section>
  )
}

export default App


/*

Things need to be add

1. fix so you can have mentor and use the timeline
2. show modal of it with info
3. opening selectors will start setion of choises - mabye (time, path type, path)
  - WeeklyTimeAvailability (in hours) 
  - PreferredPace (less steps but each invest more time in or rapid steps but a lot) 
  - RiskTolerance (this will not change the amount of knowing time we know the user have, it will simply give the user from a smooth conservative and stady path to an intresting risky one) 
  - WorkMode (solo / mixed / social) 
  - FocusAreas
4. when choosing path replace in the main step its chileds steps
5. add open ai to the 3rd chosisess

a. add step choises
b. add ai
c. add welcom/starting page



 */
