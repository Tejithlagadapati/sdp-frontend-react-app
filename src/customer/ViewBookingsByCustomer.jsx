import React, { useEffect, useState } from 'react'
import axios from '../api/axiosClient'

const ViewBookingsByCustomer = () => {
	const storedCustomer = sessionStorage.getItem('loggedInCustomer')
	const customer = storedCustomer ? JSON.parse(storedCustomer) : null
	const customerId = customer?.id
	const [bookings, setBookings] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const URL = `${import.meta.env.VITE_API_URL}/customerapi/viewbookings`

	const formatDate = (value) => {
		if (!value) return '-'
		return new Date(`${value}T00:00:00`).toLocaleDateString()
	}

	const formatDateTime = (value) => {
		if (!value) return '-'
		const date = new Date(value)
		return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
	}

	useEffect(() => {
		const fetchBookings = async () => {
			if (!customerId) {
				setBookings([])
				setError('Customer details are not available in session. Please sign in with the customer portal.')
				setLoading(false)
				return
			}

			try {
				setLoading(true)
				const response = await axios.get(`${URL}/${customerId}`)
				setBookings(Array.isArray(response.data) ? response.data : [])
				setError('')
			} catch (err) {
				setBookings([])
				if (err.response?.status === 204) {
					setError('')
				} else if (err.response?.status === 500) {
					setError('Internal Server Error - Failed to fetch bookings')
				} else if (err.request) {
					setError('Network Error - Server not responding')
				} else {
					setError('Failed to fetch bookings')
				}
			} finally {
				setLoading(false)
			}
		}

		fetchBookings()
	}, [URL, customerId])

	if (!customerId) {
		return (
			<section className="customer-section-card">
				<h2>My Bookings</h2>
				<p className="customer-error-msg">
					Customer details are not available in session. Please sign in with the customer portal.
				</p>
			</section>
		)
	}

	return (
		<section className="customer-section-card customer-bookings-section">
			<h2>My Bookings</h2>
			{error && <p className="customer-error-msg">{error}</p>}
			{loading && <p>Loading bookings...</p>}

			{!loading && !error && bookings.length === 0 && (
				<p>No bookings found.</p>
			)}

			{!loading && bookings.length > 0 && (
				<div className="customer-table-wrap no-horizontal-scroll">
					<table className="customer-table">
						<thead>
							<tr>
								<th>Booking ID</th>
								<th>Start Date</th>
								<th>End Date</th>
								<th>Slot</th>
								<th>Work Description</th>
								<th>Status</th>
								<th>Booked At</th>
								<th>Last Updated</th>
							</tr>
						</thead>
						<tbody>
							{bookings.map((booking) => (
								<tr key={booking.id}>
									<td>{booking.id}</td>
									<td>{formatDate(booking.startDate)}</td>
									<td>{formatDate(booking.endDate)}</td>
									<td>{booking.availabilityslot || '-'}</td>
									<td className="customer-cell-description">{booking.workdescription}</td>
									<td>
										<span className="customer-status-chip">{booking.status}</span>
									</td>
									<td>{formatDateTime(booking.bookedAt)}</td>
									<td>{formatDateTime(booking.statusUpdatedAt)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	)
}

export default ViewBookingsByCustomer