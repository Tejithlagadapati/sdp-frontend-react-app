import React, { useEffect, useState } from 'react'
import axios from '../api/axiosClient'

const ViewBookingsByManager = () => {
  const storedManager = sessionStorage.getItem('loggedInServiceManager')
  const manager = storedManager ? JSON.parse(storedManager) : null
  const managerId = manager?.id

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [selectedStatusByBooking, setSelectedStatusByBooking] = useState({})
  const [selectedFinalPriceByBooking, setSelectedFinalPriceByBooking] = useState({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const VIEW_URL = `${import.meta.env.VITE_API_URL}/servicemanagerapi/bookingsbymanager`
  const UPDATE_URL = `${import.meta.env.VITE_API_URL}/servicemanagerapi/updatebookingstatus`

  const statusOptions = ['BOOKED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED']

  const formatDateTime = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  useEffect(() => {
    const fetchBookings = async () => {
      if (!managerId) {
        setBookings([])
        setError('Manager details are not available in session. Please sign in with the service manager portal.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await axios.get(`${VIEW_URL}/${managerId}`)
        const bookingList = Array.isArray(response.data) ? response.data : []
        setBookings(bookingList)

        const statusMap = {}
        const finalPriceMap = {}
        bookingList.forEach((booking) => {
          statusMap[booking.id] = booking.status || 'BOOKED'
          finalPriceMap[booking.id] = booking.finalPrice ?? booking.finalprice ?? 0
        })
        setSelectedStatusByBooking(statusMap)
        setSelectedFinalPriceByBooking(finalPriceMap)

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
  }, [VIEW_URL, managerId])

  if (!managerId) {
    return (
      <section className="sm-section-card">
        <h2 style={{ textAlign: 'center' }}>View Bookings</h2>
        <p className="sm-error" style={{ textAlign: 'center' }}>
          Manager details are not available in session. Please sign in with the service manager portal.
        </p>
      </section>
    )
  }

  const handleStatusChange = (bookingId, status) => {
    setSelectedStatusByBooking((prev) => ({ ...prev, [bookingId]: status }))
  }

  const handleFinalPriceChange = (bookingId, value) => {
    setSelectedFinalPriceByBooking((prev) => ({ ...prev, [bookingId]: value }))
  }

  const handleUpdateStatus = async (booking) => {
    const nextStatus = selectedStatusByBooking[booking.id] || booking.status
    const nextFinalPrice = Number(selectedFinalPriceByBooking[booking.id])

    if (!nextStatus) {
      setMessage('')
      setError('Please select a valid booking status.')
      return
    }

    if (Number.isNaN(nextFinalPrice) || nextFinalPrice < 0) {
      setMessage('')
      setError('Please enter a valid final price.')
      return
    }

    try {
      setUpdatingId(booking.id)
      setError('')
      setMessage('')

      const payload = {
        id: booking.id,
        status: nextStatus,
        finalPrice: Number(nextFinalPrice),
      }

      const response = await axios.put(UPDATE_URL, payload)
      setMessage(response.data)

      setBookings((prev) => prev.map((item) => (
        item.id === booking.id
          ? {
            ...item,
            status: nextStatus,
            finalPrice: nextFinalPrice,
            statusUpdatedAt: new Date().toISOString(),
          }
          : item
      )))
    } catch (err) {
      setMessage('')
      if (err.response?.status === 404) {
        setError(err.response.data || 'Booking not found')
      } else if (err.response?.status === 500) {
        setError('Something went wrong')
      } else if (err.request) {
        setError('Network Error - Server not responding')
      } else {
        setError('Failed to update booking status')
      }
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <section className="sm-section-card sm-bookings-card">
      <h2 style={{ textAlign: 'center' }}>View Bookings</h2>
      {message && <p className="sm-success" style={{ textAlign: 'center' }}>{message}</p>}
      {error && <p className="sm-error" style={{ textAlign: 'center' }}>{error}</p>}
      {loading && <p className="sm-loading">Loading bookings...</p>}
      {!loading && !error && bookings.length === 0 && <p style={{ textAlign: 'center' }}>No bookings found.</p>}

      {!loading && bookings.length > 0 && (
        <div className="sm-table-wrap">
          <table className="sm-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer Name</th>
                <th>Contact</th>
                <th>Service ID</th>
                <th>Booking Time</th>
                <th>Status Updated Time</th>
                <th>Status</th>
                <th>Final Price</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="sm-cell-compact">{booking.id}</td>
                  <td>{booking.customerName || '-'}</td>
                  <td className="sm-cell-compact">{booking.customerContact || '-'}</td>
                  <td className="sm-cell-compact">{booking.serviceId ?? '-'}</td>
                  <td className="sm-cell-time">{formatDateTime(booking.bookedAt)}</td>
                  <td className="sm-cell-time">{formatDateTime(booking.statusUpdatedAt)}</td>
                  <td className="sm-cell-compact">
                    <span className="sm-status-chip">{booking.status || '-'}</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="sm-finalprice-input"
                      value={selectedFinalPriceByBooking[booking.id] ?? 0}
                      onChange={(e) => handleFinalPriceChange(booking.id, e.target.value)}
                      disabled={updatingId === booking.id}
                    />
                  </td>
                  <td>
                    <div className="sm-inline-actions">
                      <select
                        className="sm-status-select"
                        value={selectedStatusByBooking[booking.id] || booking.status || 'BOOKED'}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        disabled={updatingId === booking.id}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="sm-action-btn"
                        onClick={() => handleUpdateStatus(booking)}
                        disabled={updatingId === booking.id}
                      >
                        {updatingId === booking.id ? 'Updating...' : 'Update'}
                      </button>
                    </div>
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

export default ViewBookingsByManager