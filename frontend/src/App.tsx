import { Route, HashRouter as Router, Routes } from 'react-router-dom'

import { Navigator } from './cmps/General/Navigator'
import { Provider } from 'react-redux'
import { store } from './store/store'

import { TimelinePage } from "./pages/TimelinePage"
import { UserPage } from "./pages/UserPage"


function App() {

  return (
    <section className='app'>
      <Provider store={store}>
        <Router>
          <Navigator />
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

2. design today circle
3. make animation for circles (hover on them)
4. add day counter

a. design timeline
b. design modals
c. design use page
d. add ai



 */
