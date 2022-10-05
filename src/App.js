import { Navigate, Route, Routes } from 'react-router-dom';

import { Login } from './Login';
import { SignUp } from './Signup';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';
import { Home } from './Home';

import './App.css';


function App() {
  return (
    <div className="App">
        <Routes>
        <Route path = "/" element = {<Login/>} />
          <Route path = "/login" element = {<Login/>} />
          <Route path = "/signup" element = {<SignUp/>} />
          <Route path="/forgotpassword" element={<ForgotPassword />}/>
          <Route path="/reset-password/:id/:token" element={<ResetPassword />}/>
          <Route path="/home" element={<NavigateComponent />}/>
        </Routes>
    </div>
  );
}


export function NavigateComponent() {
  return (
    localStorage.getItem("user") ? <Home /> : <Navigate to="/login" />
  );
}

export default App;
