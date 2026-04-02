import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ViewAllCustomers = () => {
	const [customers, setCustomers] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [message, setMessage] = useState('')

	const VIEW_URL = `${import.meta.env.VITE_API_URL}/adminapi/viewallcustomers`
	const DELETE_URL = `${import.meta.env.VITE_API_URL}/adminapi/deletecustomer`

	const fetchCustomers = async () => {
		try {
			setLoading(true)
			const response = await axios.get(VIEW_URL)
			setCustomers(response.data)
			setError('')
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchCustomers()
	}, [])

	const handleDelete = async (id) => {
		const confirmed = window.confirm('Delete this customer?')
		if (!confirmed) return

		try {
			const response = await axios.delete(DELETE_URL, {
				params: { id },
			})
			setMessage(response.data)
			setError('')
			fetchCustomers()
		} catch (err) {
			setMessage('')
			if (err.response?.status === 404) {
				setError('Customer not found')
			} else {
				setError('Failed to delete customer')
			}
		}
	}

	return (
		<section className="admin-section-card">
			<h2 style={{ textAlign: 'center' }}>View All Customers</h2>
			{message && <p className="admin-success" style={{ textAlign: 'center' }}>{message}</p>}
			{error && <p className="admin-error" style={{ textAlign: 'center' }}>{error}</p>}
			{loading && <p className="admin-loading">Loading customers...</p>}
			{!loading && customers.length === 0 && <p style={{ textAlign: 'center' }}>No customers found.</p>}

			{!loading && customers.length > 0 && (
				<div className="admin-table-wrap">
					<table className="admin-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Name</th>
								<th>Username</th>
								<th>Email</th>
								<th>Contact</th>
								<th>Location</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{customers.map((customer) => (
								<tr key={customer.id}>
									<td>{customer.id}</td>
									<td>{customer.name}</td>
									<td>{customer.username}</td>
									<td>{customer.email}</td>
									<td>{customer.contact}</td>
									<td>{customer.location}</td>
									<td>
										<button
											type="button"
											onClick={() => handleDelete(customer.id)}
											className="admin-danger-btn"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	)
}

export default ViewAllCustomers
