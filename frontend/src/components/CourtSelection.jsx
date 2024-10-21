// import React from 'react';

// const CourtSelection = ({ availableCourts, selectedCourt, setSelectedCourt }) => {
//   return (
//     <div className='mt-4'>
//       <label className='pr-7'>Select Court</label>
//       <div className='flex flex-wrap gap-2 mt-2'>
//         {availableCourts.length > 0 ? (
//           availableCourts.map((court) => (
//             <button
//               key={court}
//               onClick={() => setSelectedCourt(court)}
//               className={`px-4 py-2 rounded ${
//                 selectedCourt === court 
//                   ? 'bg-primary text-white' 
//                   : 'bg-gray-200 text-gray-800'
//               }`}
//             >
//               Court {court}
//             </button>
//           ))
//         ) : (
//           <p className="text-red-500">No available courts for the selected time and duration. Please select date, time and booking hours</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourtSelection;

import React from 'react';

const CourtSelection = ({ availableCourts, selectedCourts, setSelectedCourts }) => {
  const toggleCourt = (court) => {
    if (selectedCourts.includes(court)) {
      setSelectedCourts(selectedCourts.filter(c => c !== court));
    } else {
      setSelectedCourts([...selectedCourts, court]);
    }
  };

  return (
    <div className='mt-4'>
      <label className='pr-7'>Select Courts</label>
      <div className='flex flex-wrap gap-2 mt-2'>
        {availableCourts.length > 0 ? (
          availableCourts.map((court) => (
            <button
              key={court}
              onClick={() => toggleCourt(court)}
              className={`px-4 py-2 rounded ${
                selectedCourts.includes(court)
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Court {court}
            </button>
          ))
        ) : (
          <p className="text-red-500">No available courts for the selected time and duration. Please select date, time and booking hours</p>
        )}
      </div>
      {selectedCourts.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          Selected courts: {selectedCourts.map(court => `Court ${court}`).join(', ')}
        </p>
      )}
    </div>
  );
};

export default CourtSelection;