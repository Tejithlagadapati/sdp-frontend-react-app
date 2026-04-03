import React from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './customer.css'
import CustomerHome from './CustomerHome'
import CustomerProfile from './CustomerProfile'
import BookingService from './BookingService'
import ViewBookingsByCustomer from './ViewBookingsByCustomer'
import PageNotFound from '../pages/PageNotFound'
import { useAuth } from '../context/AuthContext'

const CustomerNavBar = () => {
	const navigate = useNavigate()
	const { logout } = useAuth()

	const handleLogout = () => {
		logout()
		navigate('/')
	}

	return (
		<div className="customer-layout">
			<nav className="customer-navbar">
				<div className="customer-brand">Customer Panel</div>

				<ul className="customer-nav-links">
					<li><Link to="/customer/home">Home</Link></li>
					<li><Link to="/customer/bookservice">Book Service</Link></li>
					<li><Link to="/customer/viewbookings">My Bookings</Link></li>
					<li><Link to="/customer/profile">Profile</Link></li>
					<li><button type="button" onClick={handleLogout}>Logout</button></li>
				</ul>
			</nav>

			<main className="customer-page-wrap">
				<Routes>
					<Route path="/" element={<Navigate to="/customer/home" replace />} />
					<Route path="/customer/home" element={<CustomerHome />} />
					<Route path="/customer/bookservice" element={<BookingService />} />
					<Route path="/customer/viewbookings" element={<ViewBookingsByCustomer />} />
					<Route path="/customer/profile" element={<CustomerProfile />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</main>
		</div>
	)
}

export default CustomerNavBar