import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ViewAllServiceManagers = () => {
	const [managers, setManagers] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [message, setMessage] = useState('')

	const VIEW_URL = `${import.meta.env.VITE_API_URL}/adminapi/viewallservicemanagers`
	const DELETE_URL = `${import.meta.env.VITE_API_URL}/adminapi/deleteservicemanager`

	const fetchManagers = async () => {
		try {
			setLoading(true)
			const response = await axios.get(VIEW_URL)
			setManagers(response.data)
			setError('')
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchManagers()
	}, [])

	const handleDelete = async (id) => {
		const confirmed = window.confirm('Do You Want To Delete this service manager?')
		if (!confirmed) return

		try {
			const response = await axios.delete(`${DELETE_URL}/${id}`)
			setMessage(response.data)
			setError('')
			fetchManagers()
		} catch (err) {
			if (err.response?.status === 404) {
				setError('Service manager not found')
			} else {
				setError(err.response.data)
			}
			setMessage('')
		} 
	}

	return (
		<section className="admin-section-card admin-section-card-wide">
			<h2 style={{ textAlign: 'center' }}>View All Service Managers</h2>
			{message && <p className="admin-success" style={{ textAlign: 'center' }}>{message}</p>}
			{error && <p className="admin-error" style={{ textAlign: 'center' }}>{error}</p>}
			{loading && <p className="admin-loading">Loading service managers...</p>}
			{!loading && managers.length === 0 && <p style={{ textAlign: 'center' }}>No service managers found.</p>}

			{!loading && managers.length > 0 && (
				<div className="admin-table-wrap">
					<table className="admin-table admin-table-stretch">
						<thead>
							<tr>
								<th>ID</th>
								<th className="company-col">Company Name</th>
								<th className="company-col">Location</th>
								<th className="company-col">Company Type</th>
								<th className="company-col">Company Email</th>
								<th className="company-col">Company Contact</th>
								<th className="manager-col">Manager Name</th>
								<th className="manager-col">Gender</th>
								<th className="manager-col">Manager Email</th>
								<th className="manager-col">Manager Contact</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{managers.map((manager) => (
								<tr key={manager.id}>
									<td>{manager.id}</td>
									<td className="company-col">{manager.companyname}</td>
									<td className="company-col">{manager.companylocation}</td>
									<td className="company-col">{manager.companytype}</td>
									<td className="company-col">{manager.companyemail}</td>
									<td className="company-col">{manager.companycontact}</td>
									<td className="manager-col">{manager.managername}</td>
									<td className="manager-col">{manager.managergender}</td>
									<td className="manager-col">{manager.manageremail}</td>
									<td className="manager-col">{manager.managercontact}</td>
									<td>
										<button
											type="button"
											onClick={() => handleDelete(manager.id)}
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

export default ViewAllServiceManagers
