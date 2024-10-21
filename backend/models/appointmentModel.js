// import mongoose from "mongoose"

// const appointmentSchema = new mongoose.Schema({
//     userId: { type: String, required: true },
//     locId: { type: String, required: true },
//     slotDate: { type: String, required: true },
//     startTime: { type: String, required: true },
//     endTime: { type: String, required: true },
//     courtId: { type: Number, required: true },
//     userData: { type: Object, required: true },
//     locData: { type: Object, required: true },
//     amount: { type: Number, required: true },
//     date: { type: Number, required: true },
//     cancelled: { type: Boolean, default: false },
//     payment: { type: Boolean, default: false },
//     isCompleted: { type: Boolean, default: false },
// })

// const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
// export default appointmentModel

import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    locId: { type: String, required: true },
    slotDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    courtId: { type: Number, required: true },
    userData: { type: Object, required: true },
    locData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    paymentDeadline: { type: Date, required: true },
})

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
export default appointmentModel