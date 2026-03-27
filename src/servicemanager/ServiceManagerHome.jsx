import React from 'react'

const ServiceManagerHome = () => {
  const manager = JSON.parse(sessionStorage.getItem('loggedInServiceManager'))
  
  return (
    <section className="sm-section-card">
      <h2>Service Manager Home</h2>
      <p>Welcome, {manager.managername}</p>
    </section>
  )
}

export default ServiceManagerHome