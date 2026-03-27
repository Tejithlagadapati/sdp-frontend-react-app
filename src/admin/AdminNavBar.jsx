import React from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './admin.css'
import AdminHome from './AdminHome'
import AddServiceManager from './AddServiceManager'
import ViewAllServiceManagers from './ViewAllServiceManagers'
import ViewAllCustomers from './ViewAllCustomers'
import PageNotFound from '../pages/PageNotFound'
import { useAuth } from '../context/AuthContext'

const AdminNavBar = () => 
{
	const navigate = useNavigate()
	const { logout } = useAuth()

	const handleLogout = () => 
	{
		logout()
		navigate('/')
	}

	return (
		<div className="admin-layout">
			<nav className="admin-navbar">
				<div className="admin-brand">Admin Panel</div>
				<ul className="admin-nav-links">
					<li><Link to="/admin/home">Home</Link></li>
					<li><Link to="/admin/addsm">Add Service Manager</Link></li>
					<li><Link to="/admin/viewallsm">View All Service Managers</Link></li>
					<li><Link to="/admin/viewallcustomers">View All Customers</Link></li>
					<li><button type="button" onClick={handleLogout}>Logout</button></li>
				</ul>
			</nav>

			<main className="admin-page-wrap">
				<Routes>
					<Route path="/" element={<Navigate to="/admin/home" replace />} />
					<Route path="/admin/home" element={<AdminHome />} />
					<Route path="/admin/addsm" element={<AddServiceManager />} />
					<Route path="/admin/viewallsm" element={<ViewAllServiceManagers />} />
					<Route path="/admin/viewallcustomers" element={<ViewAllCustomers />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</main>
		</div>
	)
}

export default AdminNavBar