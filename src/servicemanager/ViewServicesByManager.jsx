import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ViewServicesByManager = () => {
  const manager = JSON.parse(sessionStorage.getItem('loggedInServiceManager'))
  const managerId = manager.id
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const VIEW_URL = `${import.meta.env.VITE_API_URL}/servicemanagerapi/viewmyservices`
  const DELETE_URL = `${import.meta.env.VITE_API_URL}/servicemanagerapi/deleteservicedetails`

  const fetchServices = async () => {
  
    try {
      setLoading(true)
      const response = await axios.get(`${VIEW_URL}/${managerId}`)
      setServices(Array.isArray(response.data) ? response.data : [])
      setError('')
    } catch (err) {
      setServices([])
      setError(err.response?.status === 204 ? '' : 'Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this service?')
    if (!confirmed) return

    try {
      setDeletingId(id)
      const response = await axios.delete(`${DELETE_URL}/${id}`)
      setMessage(response.data)
      setError('')
      fetchServices()
    } catch (err) {
      setMessage('')
      if (err.response?.status === 500) {
        setError('Failed to delete service')
      } else {
        setError('Something went wrong while deleting service')
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="sm-section-card">
      <h2 style={{ textAlign: 'center' }}>View All Services</h2>
      {message && <p className="sm-success" style={{ textAlign: 'center' }}>{message}</p>}
      {error && <p className="sm-error" style={{ textAlign: 'center' }}>{error}</p>}
      {loading && <p className="sm-loading">Loading services...</p>}
      {!loading && services.length === 0 && <p style={{ textAlign: 'center' }}>No services found.</p>}

      {!loading && services.length > 0 && (
        <div className="sm-table-wrap">
          <table className="sm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Base Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.name}</td>
                  <td>{service.category}</td>
                  <td>{service.description}</td>
                  <td>{service.baseprice}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDelete(service.id)}
                      className="sm-danger-btn"
                      disabled={deletingId === service.id}
                    >
                      {deletingId === service.id ? 'Deleting...' : 'Delete'}
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

export default ViewServicesByManager