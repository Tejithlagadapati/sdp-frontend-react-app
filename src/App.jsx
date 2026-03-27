import { BrowserRouter } from 'react-router-dom'
import MainNavBar from './pages/MainNavBar'
import CustomerNavBar from './customer/CustomerNavBar'
import ServiceManagerNavBar from './servicemanager/ServiceManagerNavBar'
import AdminNavBar from './admin/AdminNavBar'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppContent() {
  const { role } = useAuth()

  const renderNavBar = () => 
  {
     if (role === 'customer') return <CustomerNavBar />
    if (role === 'servicemanager') return <ServiceManagerNavBar />
    if (role === 'admin') return <AdminNavBar />
    return <MainNavBar /> 
  }

  return (
    <BrowserRouter>
      {renderNavBar()}
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent /> 
    </AuthProvider>
  )
}

export default App