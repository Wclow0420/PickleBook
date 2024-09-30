import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Locations = () => {

  const { speciality } = useParams()

  const [filterLoc, setFilterLoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { locations } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterLoc(locations.filter(loc => loc.speciality === speciality))
    } else {
      setFilterLoc(locations)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [locations, speciality])

  return (
    <div>
      <p className='text-gray-600'>Browse through the location.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'Selangor' ? navigate('/locations') : navigate('/locations/Selangor')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Selangor' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Selangor</p>
          <p onClick={() => speciality === 'Kuala Lumpur' ? navigate('/locations') : navigate('/locations/Kuala Lumpur')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Kuala Lumpur' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Kuala Lumpur</p>
          <p onClick={() => speciality === 'Perak' ? navigate('/locations') : navigate('/locations/Perak')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Perak' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Perak</p>
          <p onClick={() => speciality === 'Johor' ? navigate('/locations') : navigate('/locations/Johor')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Johor' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Johor</p>
          {/* <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Neurologist</p> */}
          {/* <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Gastroenterologist</p> */}
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterLoc.map((item, index) => (
            <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
              <img className='bg-[#EAEFFF]' src={item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                </div>
                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Locations