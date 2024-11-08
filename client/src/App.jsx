import {Auth} from './components/Auth.jsx'
import { LogIn } from './components/Login.jsx';
import {Register} from './components/Register.jsx'
import {Home} from './components/Home.jsx'
import { LogOut } from './components/LogOut.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { TeamCreation } from './components/TeamCreation.jsx';

function App() {
  return(
    <Router>
      <Routes>
      <Route path="/" element={<Auth />}></Route>
      <Route path = "/login" element={<LogIn/>}></Route>
      <Route path = "/register" element={<Register/>}></Route>
      <Route path="/home" element={<Home/>}></Route>
      <Route path="/logout" element={<LogOut/>}></Route>
      <Route path="/createteam" element={<TeamCreation/>}></Route>

      </Routes>

    </Router>
  );
}

export default App