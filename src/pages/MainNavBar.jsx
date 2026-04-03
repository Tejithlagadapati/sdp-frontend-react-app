import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import './Style.css'
import Home from './Home'
import CustomerRegistration from './CustomerRegistration'
import CustomerLogin from './CustomerLogin'
import ServiceManagerLogin from './ServiceManagerLogin'
import AdminLogin from './AdminLogin'
import Login from './Login'
import Contact from 'src/api/Contact'
import PageNotFound from './PageNotFound'

const MainNavBar = () => {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">Service Management System</div>
        <ul className="navbar-links">

          <li><Link to="/">Home</Link></li>
          <li><Link to="/customerregistration">Customer Registration</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customerregistration" element={<CustomerRegistration />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login/>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default MainNavBar
