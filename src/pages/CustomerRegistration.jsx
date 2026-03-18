import React, { useState } from 'react'
import axios from 'axios'
import './style.css'

const CustomerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    email: '',
    username: '',
    password: '',
    contact: '',
    location: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const URL = `${import.meta.env.VITE_API_URL}/customerapi/registration`

  const handleChange = (e) => 
  {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => 
  {
    e.preventDefault()

    try
    {
      const response = await axios.post(URL, formData)

      if (response.status === 201)
      {
        setMessage(response.data)
        setError('')
      }
    }
    catch (err)
    {
      setMessage('')
      if (err.response?.status === 500) 
      {
        setError("Internal Server Error - Failed to Register")
      } 
      else if (err.request) 
      {
         setError("Network Error - Server not responding")
      } 
      else 
      {
           setError("Bad Request - Check your input")
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card registration-card">
        <h2 className="login-title">Customer Registration</h2>
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
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number</label>
            <input
              type="number"
              id="contact"
              name="contact"
              placeholder="Enter contact number"
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

          <button type="submit" className="login-btn">Register</button>
        </form>
      </div>
    </div>
  )
}

export default CustomerRegistration
