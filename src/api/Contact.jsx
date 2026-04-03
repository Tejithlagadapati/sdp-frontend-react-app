import React, { useState } from 'react'
import './style.css'

const initialFormData = {
  fullname: '',
  subject: '',
  message: '',
  receiveremail: '',
  contact: '',
}

const Contact = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('Your message has been sent successfully.')
    setFormData(initialFormData)
  }

  return (
    <div className="login-container">
      <div className="login-card registration-card">
        <h2 className="login-title">Contact Us</h2>
        {message && (
          <div className="form-message form-message-success">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Enter your full name"
              value={formData.fullname}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Enter message subject"
              value={formData.subject}
              onChange={handleChange}
              required
              maxLength={120}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              maxLength={1000}
            />
          </div>

          <div className="form-group">
            <label htmlFor="receiveremail">Receiver Email</label>
            <input
              type="email"
              id="receiveremail"
              name="receiveremail"
              placeholder="Enter receiver email"
              value={formData.receiveremail}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              placeholder="Enter your contact number"
              value={formData.contact}
              onChange={handleChange}
              required
              maxLength={20}
            />
          </div>

          <button type="submit" className="login-btn">Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default Contact
