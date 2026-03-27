import React from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './servicemanager.css'
import ServiceManagerHome from './ServiceManagerHome'
import AddService from './AddService'
import ViewServicesByManager from './ViewServicesByManager'
import ViewBookingsByManager from './ViewBookingsByManager'
import PageNotFound from '../pages/PageNotFound'
import { useAuth } from '../context/AuthContext'

const ServiceManagerNavBar = () => {
	const navigate = useNavigate()
	const { logout } = useAuth()

	const handleLogout = () => {
		logout()
		navigate('/')
	}

	return (
		<div className="sm-layout">
			<nav className="sm-navbar">
				<div className="sm-brand">Service Manager Panel</div>

				<ul className="sm-nav-links">
					<li><Link to="/servicemanager/home">Home</Link></li>
					<li><Link to="/servicemanager/addservice">Add Service</Link></li>
					<li><Link to="/servicemanager/viewservices">View Services</Link></li>
					<li><Link to="/servicemanager/viewbookings">View Bookings</Link></li>
					<li><button type="button" onClick={handleLogout}>Logout</button></li>
				</ul>
			</nav>

			<main className="sm-page-wrap">
				<Routes>
					<Route path="/" element={<Navigate to="/servicemanager/home" replace />} />
					<Route path="/servicemanager/home" element={<ServiceManagerHome />} />
					<Route path="/servicemanager/addservice" element={<AddService />} />
					<Route path="/servicemanager/viewservices" element={<ViewServicesByManager />} />
					<Route path="/servicemanager/viewbookings" element={<ViewBookingsByManager />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</main>
		</div>
	)
}

export default ServiceManagerNavBar