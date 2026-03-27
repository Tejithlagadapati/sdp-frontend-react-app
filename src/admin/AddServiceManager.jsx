import React, { useState } from 'react'
import axios from 'axios'

const AddServiceManager = () => {
    const [formData, setFormData] = useState({
        companyname: '',
        companylocation: '',
        companytype: '',
        companyemail: '',
        companycontact: '',
        managername: '',
        managergender: '',
        manageremail: '',
        managercontact: '',
        username: '',
        password: '',
    })
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const URL = `${import.meta.env.VITE_API_URL}/adminapi/addservicemanager`

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(URL, formData)

            if (response.status === 201) {
                setMessage(response.data)
                setError('')
                setFormData({
                    companyname: '',
                    companylocation: '',
                    companytype: '',
                    companyemail: '',
                    companycontact: '',
                    managername: '',
                    managergender: '',
                    manageremail: '',
                    managercontact: '',
                    username: '',
                    password: '',
                })
            }
        } catch (err) {
            setMessage('')
            if (err.response?.status === 500) {
                setError('Internal Server Error - Failed to add service manager')
            } else if (err.request) {
                setError('Network Error - Server not responding')
            } else {
                setError('Bad Request - Check your input')
            }
        }
    }

    return (
        <section className="admin-section-card">
            <h2 style={{ textAlign: 'center' }}>Add Service Manager</h2>
            {message && <p className="admin-success" style={{ textAlign: 'center' }}>{message}</p>}
            {error && <p className="admin-error" style={{ textAlign: 'center' }}>{error}</p>}

            <form onSubmit={handleSubmit} className="admin-form-grid">
                <input name="companyname" placeholder="Company Name" value={formData.companyname} onChange={handleChange} required maxLength={100} />
                <input name="companylocation" placeholder="Company Location" value={formData.companylocation} onChange={handleChange} required maxLength={100} />
                <select name="companytype" value={formData.companytype} onChange={handleChange} required>
                    <option value="">Select Company Type</option>
                    <option value="Proprietorship">Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Private Limited">Private Limited</option>
                    <option value="Public Limited">Public Limited</option>
                    <option value="LLP">LLP</option>
                    <option value="Other">Other</option>
                </select>
                <input type="email" name="companyemail" placeholder="Company Email" value={formData.companyemail} onChange={handleChange} required maxLength={50} />
                <input type="number" min="0" name="companycontact" placeholder="Company Contact" value={formData.companycontact} onChange={handleChange} required />
                <input name="managername" placeholder="Manager Name" value={formData.managername} onChange={handleChange} required maxLength={50} />
                <select name="managergender" value={formData.managergender} onChange={handleChange} required>
                    <option value="">Select Manager Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                </select>
                <input type="email" name="manageremail" placeholder="Manager Email" value={formData.manageremail} onChange={handleChange} required />
                <input type="number" min="0" name="managercontact" placeholder="Manager Contact" value={formData.managercontact} onChange={handleChange} required />
                <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <button type="submit" className="admin-primary-btn">Add Service Manager</button>
            </form>
        </section>
    )
}

export default AddServiceManager