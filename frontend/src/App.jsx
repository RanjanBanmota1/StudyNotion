import { Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import React from 'react'
import './App.css'
import Navbar from './components/common/Navbar'
// import OpenRoute from './components/common/OpenRoute'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Catalog from './pages/Catalog'
import ForgotPassword from './pages/ForgotPassword'
import About from './pages/About'
import VerifyOtp from './pages/VerifyOtp'

function App() {

  return (
    <>
      <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />

                <Route
          path="signup"
          element={
 
              <Signup />
          }
        />
          <Route
          path="login"
          element={

              <Login />

          }
        />

          <Route
          path="catalog/:catalogName" element={
              <Catalog />
            } 
          />

            <Route
              path = "forgot-password"
              element = {<ForgotPassword />}
            />

            <Route
              path = "about"
              element = {<About />}
            />

            <Route
              path = "verify-email"
              element = {<VerifyOtp/>}
            />
        </Routes>
        
        
      </div>  
    </>
  )
}

export default App
