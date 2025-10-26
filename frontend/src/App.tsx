import { Route, HashRouter as Router, Routes } from 'react-router-dom'

import { Menu } from './cmps/General/Menu'
import { Provider } from 'react-redux'
import { store } from './store/store'

import { TimelinePage } from "./pages/TimelinePage"
import { UserPage } from "./pages/UserPage"
import { WelcomePage } from './pages/WelcomePage'


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
            <Route path='/welcome' element={<WelcomePage />}/>
          </Routes>
        </Router>
      </Provider>
    </section>
  )
}

export default App


/*

extras
1. adding text while loading screen to fake thinking progress better better 
  + make precentage continue when on another tab
2. make modal that warn hidden overwriting when using the mentor on step
3. menu modal close when not clicking on it
4. when user back to the web and pass a step modal will ask if it did it 
  -> if not move the step into today + 1 (move other steps if needed)
5. at the end of welcome page tell in create modal button what missing if there is
6. add tutorial screenshot

design
1. make path+step geting bigger when hovering ✅
2. make mentor blue and unclickble on finished main step ✅
4. make the loading screen better ✅

5. fix timeline and models be in acuurate size in diffrent rezolutions ✅
6. make the menu better
7. make the background cooler

8. make the opem ai images fite to the theme
9. make the paths icon fron open ai better looking even mabye covert to images
10. make profile + signup/login page look better
11. make welcome page look better when converting 
12. make edit+hover modals mabye look better as well

a. design
b. create ai answer better + more options?
c. deployment

 */
