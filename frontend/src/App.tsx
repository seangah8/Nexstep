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

Things need to be fixed

1. add loading circle on screen on actions (especially ai loading)
2. make so user cant set main step to over 99,999 days
3. when creating goal - also generate image if user did not choose one


4. make modal that warn hidden overwriting when using the mentor on step
5. menu modal close when not clicking on it
6. when user back to the web and pass a step modal will ask if it did it 
  -> if not move the step into today + 1 (move other steps if needed)
7. at the end of welcome page tell in create modal button what missing if there is
8. add tutorial screenshot

a. design
b. create ai answer better + more options?
c. deployment

 */
