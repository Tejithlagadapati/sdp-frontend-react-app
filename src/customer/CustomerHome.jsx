import React from 'react'

const CustomerHome = () => {
  
  const customer = JSON.parse(sessionStorage.getItem('loggedInCustomer'))
 
  return (
    <section className="customer-section-card">
      <h2>Customer Home</h2>
      <p>Welcome, {customer.name}</p>
    </section>
  )
}

export default CustomerHome