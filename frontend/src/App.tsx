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

0. when creating path with mentor make the main start from its start or the todays
1. make function that gather all the info for ai when getting into path options
2. make function that fake gadering the ai path options and appy on code
3. learn how to use open ai api
4. signup to use open ai api
5. add open ai to project

a. add ai
b. add welcom/starting page



 */
