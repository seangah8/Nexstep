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


1. fix so draging step close edit modal / change there the date

a. design
b. add step choises
c. add ai
d. add welcom/starting page



 */
