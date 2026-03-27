import React from 'react'

const AdminHome = () => {
  const admin = JSON.parse(sessionStorage.getItem('loggedInAdmin'))
 
  return (
    <section className="admin-section-card">
      <h2>Admin Home</h2>
      <p>Welcome, {admin.username}</p>
    </section>
  )
}

export default AdminHome