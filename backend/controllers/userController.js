import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import locationModel from "../models/locationModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import razorpay from 'razorpay';

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to get available courts
const getAvailableCourts = async (req, res) => {
    try {
        const { locId, slotDate, startTime, endTime } = req.query;
        const location = await locationModel.findById(locId);
        
        if (!location) {
            return res.json({ success: false, message: 'Location not found' });
        }

        // Find all appointments for the given location and date that overlap with the requested time slot
        const bookedAppointments = await appointmentModel.find({
            locId,
            slotDate,
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } },
                { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: endTime } }] }
            ]
        });

        // Get the courtIds of booked appointments
        const bookedCourtIds = new Set(bookedAppointments.map(apt => apt.courtId));

        // Generate an array of all court numbers based on totalCourt
        const allCourts = Array.from({ length: location.totalCourt }, (_, i) => i + 1);

        // Filter out the booked courts to get available courts
        const availableCourts = allCourts.filter(court => !bookedCourtIds.has(court));

        res.json({ success: true, availableCourts });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



// Updated API to book appointment
// const bookAppointment = async (req, res) => {
//     try {
//         const { userId, locId, slotDate, startTime, endTime, duration, courtIds } = req.body;
//         const locData = await locationModel.findById(locId).select("-password");
        
//         if (!locData.available) {
//             return res.json({ success: false, message: 'Location Not Available' });
//         }

//         // Check if any of the selected courts are already booked
//         const conflictingAppointments = await appointmentModel.findOne({
//             locId,
//             slotDate,
//             courtId: { $in: courtIds },
//             $or: [
//                 { startTime: { $lt: endTime, $gte: startTime } },
//                 { endTime: { $gt: startTime, $lte: endTime } },
//                 { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: endTime } }] }
//             ]
//         });

//         if (conflictingAppointments) {
//             return res.json({ success: false, message: 'One or more courts are not available for the selected time slot' });
//         }

//         const userData = await userModel.findById(userId).select("-password");

//         // Create appointments for each selected court
//         const appointments = courtIds.map(courtId => ({
//             userId,
//             locId,
//             userData,
//             locData,
//             amount: locData.fees * duration,
//             startTime,
//             endTime,
//             duration,
//             courtId,
//             slotDate,
//             date: Date.now()
//         }));

//         await appointmentModel.insertMany(appointments);
//         res.json({ success: true, message: 'Appointments Booked Successfully' });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };


const bookAppointment = async (req, res) => {
    try {
        const { userId, locId, slotDate, startTime, endTime, duration, courtIds } = req.body;
        const locData = await locationModel.findById(locId).select("-password");
        
        if (!locData.available) {
            return res.json({ success: false, message: 'Location Not Available' });
        }

        const conflictingAppointments = await appointmentModel.findOne({
            locId,
            slotDate,
            courtId: { $in: courtIds },
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } },
                { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: endTime } }] }
            ]
        });

        if (conflictingAppointments) {
            return res.json({ success: false, message: 'One or more courts are not available for the selected time slot' });
        }

        const userData = await userModel.findById(userId).select("-password");
        const paymentDeadline = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        const appointments = courtIds.map(courtId => ({
            userId,
            locId,
            userData,
            locData,
            amount: locData.fees * duration,
            startTime,
            endTime,
            duration,
            courtId,
            slotDate,
            date: Date.now(),
            paymentDeadline
        }));

        const createdAppointments = await appointmentModel.insertMany(appointments);

        // Schedule automatic deletion after payment deadline
        createdAppointments.forEach(appointment => {
            setTimeout(async () => {
                try {
                    const apt = await appointmentModel.findById(appointment._id);
                    if (apt && !apt.payment) {
                        await appointmentModel.findByIdAndDelete(appointment._id);
                    }
                } catch (error) {
                    console.error('Error in auto-deletion:', error);
                }
            }, 10 * 60 * 1000);
        });

        res.json({ success: true, message: 'Appointments Booked Successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Add a cleanup function to periodically remove expired unpaid appointments
const cleanupExpiredAppointments = async () => {
    try {
        const now = new Date();
        await appointmentModel.deleteMany({
            payment: false,
            paymentDeadline: { $lt: now }
        });
    } catch (error) {
        console.error('Error in cleanup:', error);
    }
};

// API to cancel appointment
// const cancelAppointment = async (req, res) => {
//     try {

//         const { userId, appointmentId } = req.body
//         const appointmentData = await appointmentModel.findById(appointmentId)

//         // verify appointment user 
//         if (appointmentData.userId !== userId) {
//             return res.json({ success: false, message: 'Unauthorized action' })
//         }

//         await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

//         // releasing doctor slot 
//         const { locId, slotDate, startTime, endTime } = appointmentData

//         const locationData = await locationModel.findById(locId)

//         let slots_booked = locationData.slots_booked

//         slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== startTime)

//         await locationModel.findByIdAndUpdate(locId, { slots_booked })

//         res.json({ success: true, message: 'Appointment Cancelled' })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;
        
        // Delete the appointment instead of marking as cancelled
        await appointmentModel.findByIdAndDelete(appointmentId);
        
        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true, message: 'Payment Successful' })
        }

        res.json({ success: false, message: 'Payment Failed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}
setInterval(cleanupExpiredAppointments, 60 * 1000);

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe,
    getAvailableCourts,
}