import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ViewAllCustomers = () => {
	const [customers, setCustomers] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const URL = `${import.meta.env.VITE_API_URL}/adminapi/viewallcustomers`

	const fetchCustomers = async () => {
		try {
			setLoading(true)
			const response = await axios.get(URL)
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

	return (
		<section className="admin-section-card">
			<h2 style={{ textAlign: 'center' }}>View All Customers</h2>
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