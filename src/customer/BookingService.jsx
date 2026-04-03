import React, { useEffect, useState } from 'react'
import axios from '../api/axiosClient'

const BookingService = () => {
	const storedCustomer = sessionStorage.getItem('loggedInCustomer')
	const customer = storedCustomer ? JSON.parse(storedCustomer) : null
	const customerId = customer?.id

	const [formData, setFormData] = useState({
		startDate: '',
		endDate: '',
		availabilityslot: '',
		workdescription: '',
	})
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [services, setServices] = useState([])
	const [loadingServices, setLoadingServices] = useState(true)
	const [selectedService, setSelectedService] = useState(null)

	const BOOK_URL = `${import.meta.env.VITE_API_URL}/customerapi/bookservice`
	const VIEW_SERVICES_URL = `${import.meta.env.VITE_API_URL}/customerapi/viewservices`
	const today = new Date().toISOString().split('T')[0]

	const getCompanyDetails = (service) => {
		const manager = service?.serviceManager || service?.manager || null

		return {
			name: manager?.companyname || service?.companyname || 'Not Available',
			location: manager?.companylocation || service?.companylocation || 'Not Available',
			type: manager?.companytype || service?.companytype || 'Not Available',
			email: manager?.companyemail || service?.companyemail || 'Not Available',
			contact: manager?.companycontact || service?.companycontact || 'Not Available',
		}
	}

	useEffect(() => {
		const fetchServices = async () => {
			if (!customerId) {
				setLoadingServices(false)
				return
			}

			try {
				setLoadingServices(true)
				const response = await axios.get(VIEW_SERVICES_URL)
				setServices(Array.isArray(response.data) ? response.data : [])
				setError('')
			} catch (err) {
				setServices([])
				if (err.response?.status === 500) {
					setError('Internal Server Error - Failed to fetch services')
				} else if (err.request) {
					setError('Network Error - Server not responding')
				} else {
					setError('Failed to fetch services')
				}
			} finally {
				setLoadingServices(false)
			}
		}

		fetchServices()
	}, [VIEW_SERVICES_URL, customerId])

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!customerId) {
			setMessage('')
			setError('Customer details are not available in session. Please sign in with the customer portal.')
			return
		}

		if (formData.startDate < today) {
			setMessage('')
			setError('Start date cannot be in the past.')
			return
		}

		if (formData.endDate < formData.startDate) {
			setMessage('')
			setError('End date must be the same as or after the start date.')
			return
		}

		const payload = {
			customer: { id: Number(customerId) },
			service: { id: Number(selectedService.id) },
			startDate: formData.startDate,
			endDate: formData.endDate,
			availabilityslot: formData.availabilityslot,
			workdescription: formData.workdescription,
			finalprice: 0,
			status: 'BOOKED',
		}

		try {
			setSubmitting(true)
			setError('')
			setMessage('')
			const response = await axios.post(BOOK_URL, payload)

			if (response.status === 201) {
				setMessage(response.data)
				setError('')
				setSelectedService(null)
				setFormData({
					startDate: '',
					endDate: '',
					availabilityslot: '',
					workdescription: '',
				})
			}
		} catch (err) {
			setMessage('')
			if (err.response?.status === 500) {
				setError('Internal Server Error - Failed to book service')
			} else if (err.request) {
				setError('Network Error - Server not responding')
			} else {
				setError('Bad Request - Check your input')
			}
		} finally {
			setSubmitting(false)
		}
	}

	if (!customerId) {
		return (
			<section className="customer-section-card">
				<h2>Book Service</h2>
				<p className="customer-error-msg">
					Customer details are not available in session. Please sign in with the customer portal.
				</p>
			</section>
		)
	}

	return (
		<section className="customer-section-card">
			<h2>Book Service</h2>
			{message && <p className="customer-success-msg">{message}</p>}
			{error && <p className="customer-error-msg">{error}</p>}

			{!selectedService && loadingServices && <p>Loading services...</p>}

			{!selectedService && !loadingServices && !error && services.length === 0 && (
				<p>No services available right now.</p>
			)}

			{!selectedService && !loadingServices && services.length > 0 && (
				<div className="customer-services-grid">
					{services.map((service) => {
						const company = getCompanyDetails(service)

						return (
						<article key={service.id} className="customer-service-card">
							<h3>{service.name}</h3>
							<p><strong>Category:</strong> {service.category}</p>
							<p><strong>Description:</strong> {service.description}</p>
							<p><strong>Base Price:</strong> {service.baseprice}</p>
							<p><strong>Company:</strong> {company.name}</p>
							<p><strong>Location:</strong> {company.location}</p>
							<p><strong>Type:</strong> {company.type}</p>
							<p><strong>Company Email:</strong> {company.email}</p>
							<p><strong>Company Contact:</strong> {company.contact}</p>
							<button
								type="button"
								className="customer-primary-btn"
								onClick={() => {
									setSelectedService(service)
									setMessage('')
									setError('')
								}}
							>
								Book This Service
							</button>
						</article>
						)
					})}
				</div>
			)}

			{selectedService && (
				<div className="customer-selected-service">
					{(() => {
						const company = getCompanyDetails(selectedService)

						return (
							<>
					<h3>Selected Service: {selectedService.name}</h3>
					<p><strong>Category:</strong> {selectedService.category}</p>
					<p><strong>Base Price:</strong> {selectedService.baseprice}</p>
					<p><strong>Company:</strong> {company.name}</p>
					<p><strong>Location:</strong> {company.location}</p>
					<p><strong>Type:</strong> {company.type}</p>
					<p><strong>Company Email:</strong> {company.email}</p>
					<p><strong>Company Contact:</strong> {company.contact}</p>
					<button
						type="button"
						className="customer-secondary-btn"
						onClick={() => {
							setSelectedService(null)
							setError('')
						}}
					>
						Choose Another Service
					</button>
							</>
						)
					})()}
				</div>
			)}

			{selectedService && (
				<form onSubmit={handleSubmit} className="customer-form-grid">
				

				<div className="customer-form-group">
					<label htmlFor="startDate">Start Date</label>
					<input
						id="startDate"
						name="startDate"
						type="date"
						min={today}
						value={formData.startDate}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="customer-form-group">
					<label htmlFor="endDate">End Date</label>
					<input
						id="endDate"
						name="endDate"
						type="date"
						min={formData.startDate || today}
						value={formData.endDate}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="customer-form-group">
					<label htmlFor="availabilityslot">Availability Slot</label>
					<select
						id="availabilityslot"
						name="availabilityslot"
						value={formData.availabilityslot}
						onChange={handleChange}
						required
					>
						<option value="">Select slot</option>
						<option value="7 to 12">7 to 12</option>
						<option value="12 to 4">12 to 4</option>
						<option value="4 to 8">4 to 8</option>
						<option value="8 to 12">8 to 12</option>
					</select>
				</div>

				<div className="customer-form-group customer-form-group-full">
					<label htmlFor="workdescription">Work Description</label>
					<textarea
						id="workdescription"
						name="workdescription"
						value={formData.workdescription}
						onChange={handleChange}
						placeholder="Describe the work needed"
						required
						maxLength={500}
					/>
				</div>

				<button type="submit" className="customer-primary-btn" disabled={submitting}>
					{submitting ? 'Booking...' : 'Book Service'}
				</button>
				</form>
			)}
		</section>
	)
}

export default BookingService