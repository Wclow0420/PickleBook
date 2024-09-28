import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const LocationContext = createContext()

const locationContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [lToken, setLToken] = useState(localStorage.getItem('lToken') ? localStorage.getItem('lToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    // Getting Location appointment data from Database using API
    const getAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/location/appointments', { headers: { lToken } })

            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting Location profile data from Database using API
    const getProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/location/profile', { headers: { lToken } })
            console.log(data.profileData)
            setProfileData(data.profileData)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel location appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/location/cancel-appointment', { appointmentId }, { headers: { lToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // after creating dashboard
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/location/complete-appointment', { appointmentId }, { headers: { lToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // Later after creating getDashData Function
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting location dashboard data using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/location/dashboard', { headers: { lToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const value = {
        lToken, setLToken, backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
    }

    return (
        <LocationContext.Provider value={value}>
            {props.children}
        </LocationContext.Provider>
    )


}

export default locationContextProvider