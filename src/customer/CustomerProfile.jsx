import React, { useState } from 'react'
import axios from 'axios'

const CustomerProfile = () => 
{
	const [formData, setFormData] = useState(() => 
	{
		const loggedInCustomer = sessionStorage.getItem('loggedInCustomer')
		if (!loggedInCustomer) {
			return {
				email: '',
				username: '',
				gender: '',
				name: '',
				contact: '',
				location: '',
				password: ''
			}
		}

		const customer = JSON.parse(loggedInCustomer)
		return {
			email: customer.email,
			username: customer.username,
			gender: customer.gender,
			name: customer.name,
			contact: customer.contact,
			location: customer.location,
			password: customer.password
		}
	})
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')

	const URL = `${import.meta.env.VITE_API_URL}/customerapi/updateprofile`

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const loggedInCustomer = sessionStorage.getItem('loggedInCustomer')
			const customer = JSON.parse(loggedInCustomer)
			
			const response = await axios.post(URL, {
				id: customer.id,
				name: formData.name,
				contact: formData.contact,
				location: formData.location,
				password: formData.password
			})

			if (response.status === 201) {
				const updatedCustomer = {
					...customer,
					name: formData.name,
					contact: formData.contact,
					location: formData.location,
					password: formData.password
				}
				sessionStorage.setItem('loggedInCustomer', JSON.stringify(updatedCustomer))
				setMessage(response.data)
				setError('')
			}
		} catch (err) {
			setMessage('')
			if (err.response?.status === 500) {
				setError('Internal Server Error - Failed to Update Profile')
			} else if (err.request) {
				setError('Network Error - Server not responding')
			} else {
				setError('Bad Request - Check your input')
			}
		}
	}

	return (
		<section className="customer-section-card">
			<h2>Update Customer Profile</h2>
			{message && (
				<div className="form-message">
					{message}
				</div>
			)}
			{error && (
				<div className="form-message form-message-error">
					{error}
				</div>
			)}
			<form onSubmit={handleSubmit} className="login-form">
				<div className="form-group">
					<label htmlFor="email">Email Address</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						disabled
					/>
				</div>

				<div className="form-group">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						value={formData.username}
						disabled
					/>
				</div>

				<div className="form-group">
					<label htmlFor="gender">Gender</label>
					<input
						type="text"
						id="gender"
						name="gender"
						value={formData.gender}
						disabled
					/>
				</div>

				<div className="form-group">
					<label htmlFor="name">Full Name</label>
					<input
						type="text"
						id="name"
						name="name"
						placeholder="Enter your full name"
						value={formData.name}
						onChange={handleChange}
						required
						maxLength={50}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="contact">Contact Number</label>
					<input
						type="text"
						id="contact"
						name="contact"
						placeholder="Enter your contact number"
						value={formData.contact}
						onChange={handleChange}
						required
						maxLength={20}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="location">Location</label>
					<input
						type="text"
						id="location"
						name="location"
						placeholder="Enter your location"
						value={formData.location}
						onChange={handleChange}
						required
						maxLength={100}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Enter your password"
						value={formData.password}
						onChange={handleChange}
						required
						maxLength={50}
					/>
				</div>

				<button type="submit" className="login-btn">Update Profile</button>
			</form>
		</section>
	)
}

export default CustomerProfile