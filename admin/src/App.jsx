import React, { useContext } from 'react'
import { LocationContext } from './context/LocationContent';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddLocation from './pages/Admin/AddLocation';
import LocationsList from './pages/Admin/LocationsList';
import Login from './pages/Login';
import LocationAppointments from './pages/Location/LocationAppointments';
import LocationDashboard from './pages/Location/LocationDashboard';
import LocationProfile from './pages/Location/LocationProfile';

const App = () => {

  const { lToken } = useContext(LocationContext)
  const { aToken } = useContext(AdminContext)

  return lToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-location' element={<AddLocation />} />
          <Route path='/location-list' element={<LocationsList />} />
          <Route path='/location-dashboard' element={<LocationDashboard />} />
          <Route path='/location-appointments' element={<LocationAppointments />} />
          <Route path='/location-profile' element={<LocationProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App