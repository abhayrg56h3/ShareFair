import { useContext, useState } from "react";
import Register from "./Component/Register";
import "./App.css";
import Dashboard from "./Component/Dashboard";
import Navbar from "./Component/Navbar";
import Home from "./Component/Home";
import Profile from "./Component/Profile";
import CreateGroup from "./Component/CreateGroup";
import Expenses from "./Component/Expenses";
import AuthContext, { myContext } from "./Component/AuthContext";
import Loading from "./Component/Loading";
import SettleUp from "./Component/SettleUp";
import Reset from "./Component/Reset";
import ForgotPassword from "./Component/Forgot";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
function App() {
  const {currUser,loading}=useContext(myContext);


  if(loading) {
    return <Loading />;
  }




  return (
    <>
    
    
        <Router>
        {currUser && <Navbar/>}   
          <Routes>
          <Route path="/register" element={<Register />} />
            <Route path="/" element={currUser?<Home/>:<Register/>}/>
            <Route path="/dashboard" element={currUser?<Dashboard />:<Navigate to="/register" />} />
            <Route path="/profile" element={currUser?<Profile currUser={currUser} />:<Navigate to="/register" />} />
            <Route path="/creategroup" element={currUser?<CreateGroup />:<Navigate to="/register" />} />
              <Route path="/forgot" element={<ForgotPassword />} />
                    <Route path="/reset/:token" element={<Reset />} />
          </Routes>
        </Router>

        {/* <SettleUp/> */}
  
      
     
    </>
  );
}

export default App;
