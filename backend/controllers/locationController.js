import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import locationModel from "../models/locationModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API for location Login 
const loginLocation = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await locationModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get location appointments for location panel
const appointmentsLocation = async (req, res) => {
    try {

        const { locId } = req.body
        const appointments = await appointmentModel.find({ locId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for location panel
const appointmentCancel = async (req, res) => {
    try {

        const { locId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.locId === locId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for location panel
const appointmentComplete = async (req, res) => {
    try {

        const { locId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.locId === locId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all locations list for Frontend
const locationList = async (req, res) => {
    try {

        const locations = await locationModel.find({}).select(['-password', '-email'])
        res.json({ success: true, locations })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change location availablity for Admin and Location Panel
const changeAvailablity = async (req, res) => {
    try {

        const { locId } = req.body

        const locData = await locationModel.findById(locId)
        await locationModel.findByIdAndUpdate(locId, { available: !locData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get location profile for  Location Panel
const locationProfile = async (req, res) => {
    try {

        const { locId } = req.body
        const profileData = await locationModel.findById(locId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update location profile data from  Location Panel
const updateLocationProfile = async (req, res) => {
    try {

        const { locId, fees, address, available } = req.body

        await locationModel.findByIdAndUpdate(locId, { fees, address, available })

        res.json({ success: true, message: 'Loaction Details Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for locations panel
const locationDashboard = async (req, res) => {
    try {

        const { locId } = req.body

        const appointments = await appointmentModel.find({ locId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginLocation,
    appointmentsLocation,
    appointmentCancel,
    locationList,
    changeAvailablity,
    appointmentComplete,
    locationDashboard,
    locationProfile,
    updateLocationProfile
}