import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './style.css'
import { useAuth } from '../context/AuthContext'

const ServiceManagerLogin = () => {
  const [formData, setFormData] = useState({ manageremail: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { loginAs } = useAuth()

  const URL = `${import.meta.env.VITE_API_URL}/servicemanagerapi/login`

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(URL, formData)

      if (response.status === 200) {
        sessionStorage.setItem('loggedInServiceManager', JSON.stringify(response.data))
        loginAs('servicemanager')
        setError('')
        navigate('/servicemanager/home')
      }
    } catch (err) {
      setMessage('')
      if (err.response?.status === 401) {
        setError(err.response.data)
      } else if (err.response?.status === 500) {
        setError('Internal Server Error')
      } else if (err.request) {
        setError('Network Error - Server not responding')
      } else {
        setError('Bad Request - Check your input')
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Service Manager Login</h2>
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
              id="manageremail"
              name="manageremail"
              placeholder="Enter your email"
              value={formData.manageremail}
              onChange={handleChange}
              required
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
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  )
}

export default ServiceManagerLogin