import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './style.css'

const URL = `${import.meta.env.VITE_API_URL}/auth/login`

const getDashboardPath = (role) => {
  if (role === 'ADMIN') {
    return '/admin/home'
  }

  if (role === 'CUSTOMER') {
    return '/customer/home'
  }

  if (role === 'MANAGER') {
    return '/servicemanager/home'
  }

  return '/'
}

const storeUserSession = (role, user) => {
  sessionStorage.removeItem('loggedInAdmin')
  sessionStorage.removeItem('loggedInCustomer')
  sessionStorage.removeItem('loggedInServiceManager')

  if (role === 'ADMIN') {
    sessionStorage.setItem('loggedInAdmin', JSON.stringify(user))
  }

  if (role === 'CUSTOMER') {
    sessionStorage.setItem('loggedInCustomer', JSON.stringify(user))
  }

  if (role === 'MANAGER') {
    sessionStorage.setItem('loggedInServiceManager', JSON.stringify(user))
  }
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ login: '', password: '', role: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    if (!formData.role) {
      setMessage('')
      setError('Please select a role')
      return
    }

    try {
      const response = await axios.post(URL, formData)

      if (response.status === 200) {
        const data = response.data

        login({ token: data.token, role: data.role })
        storeUserSession(data.role, data.user)

        setMessage('')
        setError('')
        navigate(getDashboardPath(data.role))
      }
    } catch (err) {
      setMessage('')
      if (err.response?.status === 401 || err.response?.status === 403) {
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
      <h2 className="login-title">Login</h2>

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

      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="login">User / Email</label>
          <input
            id="login"
            type="text"
            name="login"
            placeholder="Enter your username or email"
            value={formData.login}
            onChange={handleChange}
            required
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              --select--
            </option>
            <option value="ADMIN">ADMIN</option>
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="MANAGER">MANAGER</option>
          </select>
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      </div>
    </div>
  );
}
