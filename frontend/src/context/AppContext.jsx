import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // const [doctors, setDoctors] = useState([])
    const [locations, setLocations] = useState([])

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)

    // Getting Locations using API
    const getLocatiosData = async () => {

        try {

            // const { data } = await axios.get(backendUrl + '/api/doctor/list')
            const { data } = await axios.get(backendUrl + '/api/location/list')

            
            if (data.success) {
                setLocations(data.locations)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {
            console.log("userData ", userData)

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
            console.log(data)

            if (data.success) {
                setUserData(data.userData)
                
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        getLocatiosData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value = {
        locations, getLocatiosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider