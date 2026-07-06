import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'


const DoctorsList = () => {

  const {doctors, aToken ,getAllDoctors, changeAvailability} = useContext(AdminContext)

  useEffect(()=>{
    if (aToken) {
      getAllDoctors()
    }

  },[aToken])
//design of tutorial 
  // return (
  //   <div className='m-5 max-h-[90vh] overflow-y-scroll'>
  //     <h1 className='text-lg font-medium'>All Doctors</h1>
  //     <div className='w-full  flex flex-wrap gap-4 mt-5 gap-y-6  '>
  //       {
  //         doctors.map((item,index)=>(
  //       <div className='group border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer ' key={index}>
  //             <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
  //             <div className='p-4'>
  //               <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
  //               <p className='text-zinc-600 text-sm'>{item.speciality}</p>
  //               <div className='mt-2 flex items-center gap-1 text-sm '>
  //                 <input  className="accent-blue-500" type="checkbox" checked={item.available} />
  //                 <p>Available</p>

  //               </div>
  //             </div>

  //           </div>
  //         ))
  //       }
  //     </div>
  //   </div>
  // )


  //design enchancd by gpt

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-5'>
        {doctors.map((item, index) => (
          <div
            className='group border border-indigo-200 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 bg-white'
            key={index}
          >
            <img
              className='w-full h-56 object-cover bg-indigo-50 group-hover:bg-primary transition-all duration-500'
              src={item.image}
              alt={item.name}
            />
            <div className='p-4 text-center'>
              <p className='text-neutral-800 text-lg font-semibold'>{item.name}</p>
              <p className='text-zinc-600 text-sm mb-2'>{item.speciality}</p>
              <div className='flex items-center justify-center gap-2 text-sm'>
                <input
                onChange={()=>changeAvailability(item._id)}
                  type='checkbox'
                  checked={item.available}
                  readOnly
                  className='accent-blue-600'
                />
                <p>Available</p>      
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )


}

export default DoctorsList