import { Route, HashRouter as Router, Routes } from 'react-router-dom'

import { TimelinePage } from "./pages/TimelinePage"
import { UserPage } from "./pages/UserPage"
import { Navigator } from './cmps/General/Navigator'


function App() {

  return (
    <section className='app'>
      <Router>
        <Navigator />
        <Routes>
          <Route path='/' element={<TimelinePage />} />
          <Route path='/timeline' element={<TimelinePage />} />
          <Route path='/user' element={<UserPage />} />
        </Routes>
      </Router>
    </section>
  )
}

export default App


/*

Things need to be add

1. add user page with only username as cradentials (and login/logout)
2. add user state on redux + show user name on timeline page
3. add timeline state on redux + show goal left days on user page

a. add state management of timeline and user
b. add backend of timeline and user + auth
c. design



 */
