// import React, { useContext, useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { AppContext } from '../context/AppContext'
// import { assets } from '../assets/assets'
// import RelatedLocations from '../components/RelatedLocations'
// import axios from 'axios'
// import { toast } from 'react-toastify'

// const Appointment = () => {

//     const { locId } = useParams()
//     const { locations, currencySymbol, backendUrl, token, getLocatiosData } = useContext(AppContext)
//     const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

//     const [locInfo, setLocInfo] = useState(false)
//     const [locSlots, setLocSlots] = useState([])
//     const [slotIndex, setSlotIndex] = useState(0)
//     const [startTime, setStartTime] = useState('')
//     const [duration, setDuration] = useState('')
//     const [endTime,setEndTime] = useState('')

//     const [availableCourts, setAvailableCourts] = useState([]);
//     const [selectedCourt, setSelectedCourt] = useState(null);

//     const navigate = useNavigate()

//     const fetchLocInfo = async () => {
//         const locInfo = locations.find((loc) => loc._id === locId)
//         setLocInfo(locInfo)
//     }

//     const getAvailableSolts = async () => {

//         setLocSlots([])

//         // getting current date
//         let today = new Date()

//         for (let i = 0; i < 7; i++) {

//             // getting date with index 
//             let currentDate = new Date(today)
//             currentDate.setDate(today.getDate() + i)

//             // setting end time of the date with index
//             let endTime = new Date()
//             endTime.setDate(today.getDate() + i)
//             endTime.setHours(21, 0, 0, 0)

//             // setting hours 
//             if (today.getDate() === currentDate.getDate()) {
//                 currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
//                 currentDate.setMinutes(currentDate.getMinutes() > 30 ? 0 : 0)
//             } else {
//                 currentDate.setHours(10)
//                 currentDate.setMinutes(0)
//             }

//             let timeSlots = [];


//             while (currentDate < endTime) {
//                 let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//                 let day = currentDate.getDate()
//                 let month = currentDate.getMonth() + 1
//                 let year = currentDate.getFullYear()

//                 const slotDate = day + "_" + month + "_" + year
//                 const startTime = formattedTime

//                 const isSlotAvailable = locInfo.slots_booked[slotDate] && locInfo.slots_booked[slotDate].includes(startTime) ? false : true

//                 if (isSlotAvailable) {

//                     // Add slot to array
//                     timeSlots.push({
//                         datetime: new Date(currentDate),
//                         time: formattedTime
//                     })
//                 }

//                 // Increment current time by 30 minutes
//                 currentDate.setMinutes(currentDate.getMinutes() + 60);
//             }

//             setLocSlots(prev => ([...prev, timeSlots]))

//         }

//     }

//     // Function to calculate end time based on start time and duration
//     const calculateEndTime = (startTime, duration) => {
//         const [hour, minutePart] = startTime.split(':')
//         const minutes = parseInt(minutePart)
//         const startHour = parseInt(hour)
//         let endHour = startHour + parseInt(duration)
//         let endMinutes = minutes

//         // If the end time exceeds 24 hours, you may want to adjust it accordingly (optional)
//         if (endHour >= 24) {
//             endHour = endHour - 24
//         }

//         return `${endHour.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
//     }

//     const bookAppointment = async () => {

//         if (!token) {
//             toast.warning('Login to book appointment')
//             return navigate('/login')
//         }

//         // Check if the duration is selected before proceeding
//         if (!duration) {
//             toast.warning('Please select a duration before booking');
//             return;
//         }
//         const date = locSlots[slotIndex][0].datetime

//         let day = date.getDate()
//         let month = date.getMonth() + 1
//         let year = date.getFullYear()

//         const slotDate = day + "_" + month + "_" + year

//         // Calculate the end time using the selected start time and duration
//         const calculatedEndTime = calculateEndTime(startTime, duration)
//         setEndTime(calculatedEndTime) // Optionally set this in state if needed elsewhere

//         try {
//             const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { locId, slotDate, startTime, endTime: calculatedEndTime }, { headers: { token } })
//             if (data.success) {
//                 toast.success(data.message)
//                 getLocatiosData()
//                 navigate('/my-appointments')
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }

//     }


//     useEffect(() => {
//         if (locations.length > 0) {
//             fetchLocInfo()
//         }
//     }, [locations, locId])

//     useEffect(() => {
//         if (locInfo) {
//             getAvailableSolts()
//         }
//     }, [locInfo])

//     return locInfo ? (
//         <div>

//             {/* ---------- Location Details ----------- */}
//             <div className='flex flex-col sm:flex-row gap-4'>
//                 <div>
//                     <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={locInfo.image} alt="" />
//                 </div>

//                 <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

//                     {/* ----- Loc Info : name, ----- */}

//                     <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{locInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
//                     <div className='flex items-center gap-2 mt-1 text-gray-600'>
//                         <p>{locInfo.Area}</p>
//                         <button className='py-0.5 px-2 border text-xs rounded-full'>test</button>
//                     </div>

//                     {/* ----- Loc About ----- */}
//                     <div>
//                         <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
//                         <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{locInfo.about}</p>
//                     </div>

//                     <p className='text-gray-600 font-medium mt-4'>Appointment fee: <span className='text-gray-800'>{currencySymbol}{locInfo.fees}</span> </p>
//                 </div>
//             </div>

//             {/* Booking slots */}
//             <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
//                 <p >Booking slots</p>
//                 <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
//                     {locSlots.length && locSlots.map((item, index) => (
//                         <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}>
//                             <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
//                             <p>{item[0] && item[0].datetime.getDate()}</p>
//                         </div>
//                     ))}
//                 </div>

//                 <div className='mt-4'>
//                     <label className='pr-2' htmlFor="startTime">Select Start Time</label>
//                     <select
//                         id="startTime"
//                         className="border border-gray-300 rounded px-4 py-2 mt-2"
//                         onChange={(e) => setStartTime(e.target.value)}  // Set the selected start time
//                         value={startTime}  // Current selected value
//                     >
//                         <option value="" disabled>Select a time</option>  {/* Placeholder */}
//                         {locSlots.length > 0 && locSlots[slotIndex].map((item, index) => (
//                             <option key={index} value={item.time}>
//                                 {item.time.toLowerCase()} {/* Display the time */}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className='mt-4'>
//                     {/* Booking Hours Dropdown */}
//                     <label className='pr-7' htmlFor="duration">Booking Hours</label>
//                     <select
//                         id="duration"
//                         className="border border-gray-300 rounded px-4 py-2 mt-2"
//                         onChange={(e) => setDuration(e.target.value)}  // Set the selected duration
//                         value={duration}  // Current selected value
//                     >
//                         <option value="" disabled>Select hours</option> {/* Placeholder */}
//                         {[1, 2, 3, 4].map((hour, index) => (
//                             <option key={index} value={hour}>
//                                 {hour} hour{hour > 1 ? 's' : ''}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6'>Book an appointment</button>
//             </div>

//             {/* Listing Releated Locations */}
//             <RelatedLocations Area={locInfo.Area} locId={locId} />
//         </div>
//     ) : null
// }

// export default Appointment

import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedLocations from '../components/RelatedLocations'
import axios from 'axios'
import { toast } from 'react-toastify'
import CourtSelection from '../components/CourtSelection';

const Appointment = () => {
    const { locId } = useParams()
    const { locations, currencySymbol, backendUrl, token, getLocatiosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [locInfo, setLocInfo] = useState(false)
    const [locSlots, setLocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [startTime, setStartTime] = useState('')
    const [duration, setDuration] = useState('')
    const [endTime, setEndTime] = useState('')
    const [selectedCourt, setSelectedCourt] = useState(null)
    const [availableCourts, setAvailableCourts] = useState([])

    const navigate = useNavigate()

    const fetchLocInfo = async () => {
        const locInfo = locations.find((loc) => loc._id === locId)
        setLocInfo(locInfo)
    }

    const getAvailableSolts = async () => {
        setLocSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 0 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = `${day}_${month}_${year}`
                const startTime = formattedTime

                const isSlotAvailable = locInfo.slots_booked[slotDate] && locInfo.slots_booked[slotDate].includes(startTime) ? false : true

                if (isSlotAvailable) {
                    // Add slot to array
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                // Increment current time by 60 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 60);
            }

            setLocSlots(prev => ([...prev, timeSlots]))
        }
    }

    // Function to calculate end time based on start time and duration
    const calculateEndTime = (startTime, duration) => {
        const [hour, minutePart] = startTime.split(':')
        const minutes = parseInt(minutePart)
        const startHour = parseInt(hour)
        let endHour = startHour + parseInt(duration)
        let endMinutes = minutes

        // If the end time exceeds 24 hours, adjust it accordingly
        if (endHour >= 24) {
            endHour = endHour - 24
        }

        return `${endHour.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
    }

    const getAvailableCourts = async () => {
        if (!startTime || !duration) return
    
        try {
            const endTime = calculateEndTime(startTime, duration)
            const slotDate = `${locSlots[slotIndex][0].datetime.getDate()}_${locSlots[slotIndex][0].datetime.getMonth() + 1}_${locSlots[slotIndex][0].datetime.getFullYear()}`
            
            const { data } = await axios.get(`${backendUrl}/api/user/available-courts`, {
                params: {
                    locId,
                    slotDate,
                    startTime,
                    endTime
                }
            })
            setAvailableCourts(data.availableCourts)
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch available courts")
        }
    }

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        if (!duration) {
            toast.warning('Please select a duration before booking')
            return
        }

        if (!selectedCourt) {
            toast.warning('Please select a court before booking')
            return
        }

        const date = locSlots[slotIndex][0].datetime
        const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
        const calculatedEndTime = calculateEndTime(startTime, duration)
        setEndTime(calculatedEndTime)

        try {
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', 
                { 
                    locId, 
                    slotDate, 
                    startTime, 
                    endTime: calculatedEndTime, 
                    duration: parseInt(duration),
                    courtId: selectedCourt 
                }, 
                { headers: { token } }
            )
            if (data.success) {
                toast.success(data.message)
                getLocatiosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (locations.length > 0) {
            fetchLocInfo()
        }
    }, [locations, locId])

    useEffect(() => {
        if (locInfo) {
            getAvailableSolts()
        }
    }, [locInfo])

    useEffect(() => {
        if (startTime && duration) {
            getAvailableCourts()
        }
    }, [startTime, duration])

    return locInfo ? (
        <div>
            {/* Location Details */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={locInfo.image} alt="" />
                </div>
                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{locInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{locInfo.Area}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>test</button>
                    </div>
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{locInfo.about}</p>
                    </div>
                    <p className='text-gray-600 font-medium mt-4'>Appointment fee: <span className='text-gray-800'>{currencySymbol}{locInfo.fees}</span> </p>
                </div>
            </div>

            {/* Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
                <p>Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {locSlots.length && locSlots.map((item, index) => (
                        <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}>
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                <div className='mt-4'>
                    <label className='pr-2' htmlFor="startTime">Select Start Time</label>
                    <select
                        id="startTime"
                        className="border border-gray-300 rounded px-4 py-2 mt-2"
                        onChange={(e) => setStartTime(e.target.value)}
                        value={startTime}
                    >
                        <option value="" disabled>Select a time</option>
                        {locSlots.length > 0 && locSlots[slotIndex].map((item, index) => (
                            <option key={index} value={item.time}>
                                {item.time.toLowerCase()}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='mt-4'>
                    <label className='pr-7' htmlFor="duration">Booking Hours</label>
                    <select
                        id="duration"
                        className="border border-gray-300 rounded px-4 py-2 mt-2"
                        onChange={(e) => setDuration(e.target.value)}
                        value={duration}
                    >
                        <option value="" disabled>Select hours</option>
                        {[1, 2, 3, 4].map((hour, index) => (
                            <option key={index} value={hour}>
                                {hour} hour{hour > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <CourtSelection 
                    availableCourts={availableCourts}
                    selectedCourt={selectedCourt}
                    setSelectedCourt={setSelectedCourt}/>

                <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6'>Book an appointment</button>
            </div>

            {/* Listing Related Locations */}
            <RelatedLocations Area={locInfo.Area} locId={locId} />
        </div>
    ) : null
}

export default Appointment