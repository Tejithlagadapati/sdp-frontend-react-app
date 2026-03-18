import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import './Style.css'
import Home from './Home'
import CustomerRegistration from './CustomerRegistration'
import CustomerLogin from './CustomerLogin'
import ServiceManagerLogin from './ServiceManagerLogin'
import AdminLogin from './AdminLogin'

const MainNavBar = () => {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">Service Management System</div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>

          {/* Customer Dropdown */}
          <li className="nav-dropdown">
            <span className="nav-dropdown-label">Customer ▾</span>
            <ul className="dropdown-menu">
              <li><Link to="/customerregistration">Registration</Link></li>
              <li><Link to="/customerlogin">Login</Link></li>
            </ul>
          </li>

          
          <li><Link to="/servicemanagerlogin">Service Manager Login</Link></li>
          <li><Link to="/adminlogin">Admin Login</Link></li>
          
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customerregistration" element={<CustomerRegistration />} />
        <Route path="/customerlogin" element={<CustomerLogin />} />
        <Route path="/servicemanagerlogin" element={<ServiceManagerLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
      </Routes>
    </>
  )
}

export default MainNavBar
