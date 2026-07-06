import React from 'react'
import { useContext } from 'react'
import {AdminContext} from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets_admin/assets'

const AllAppointment = () => {

  const {aToken , appointments,getAllAppointments,cancelAppointment} = useContext(AdminContext)
  const{calculateAge,slotDateFormat,currency} = useContext(AppContext)

  useEffect(()=>{
    if (aToken) {
      getAllAppointments()
    }
  },[aToken])

  // Sort appointments by newest first
  const sortedAppointments = [...appointments].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    if (a._id && b._id) {
      return b._id.localeCompare(a._id);
    }
    return 0;
  });

  const getStatusBadge = (item) => {
    if (item.cancelled) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelled
        </span>
      )
    }
    if (item.isCompleted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completed
        </span>
      )
    }
    return (
      <button 
        onClick={() => cancelAppointment(item._id)}
        className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors duration-200 border border-red-200"
      >
        <img className='w-4 h-4 mr-1' src={assets.cancel_icon} alt="Cancel" />
        Cancel
      </button>
    )
  }

  return (
    <div className='w-full max-w-7xl mx-auto p-6'>
      {/* Header */}
      <div className="mb-6">
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>All Appointments</h1>
        <p className='text-gray-600'>Manage and track all patient appointments</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Total: {sortedAppointments.length}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Completed: {sortedAppointments.filter(apt => apt.isCompleted).length}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Cancelled: {sortedAppointments.filter(apt => apt.cancelled).length}
            </span>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        
        {/* Desktop Header */}
        <div className='hidden lg:grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1.5fr] bg-gray-50 py-4 px-6 border-b border-gray-200'>
          <p className="text-sm font-semibold text-gray-700">#</p>
          <p className="text-sm font-semibold text-gray-700">Patient</p>
          <p className="text-sm font-semibold text-gray-700">Age</p>
          <p className="text-sm font-semibold text-gray-700">Date & Time</p>
          <p className="text-sm font-semibold text-gray-700">Doctor</p>
          <p className="text-sm font-semibold text-gray-700">Fees</p>
          <p className="text-sm font-semibold text-gray-700">Status</p>
        </div>

        {/* Appointments List */}
        <div className="max-h-[70vh] overflow-y-auto">
          {sortedAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-3 3v11a2 2 0 002 2h8a2 2 0 002-2V10l-3-3" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">No appointments found</p>
              <p className="text-sm text-gray-500">Appointments will appear here once scheduled</p>
            </div>
          ) : (
            sortedAppointments.map((item, index) => (
              <div key={item._id || index}>
                {/* Desktop Row */}
                <div className='hidden lg:grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1.5fr] items-center py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150'>
                  <p className="text-sm font-medium text-gray-900">{index + 1}</p>
                  
                  <div className='flex items-center gap-3'>
                    <div className="relative">
                      <img 
                        className='w-10 h-10 rounded-full object-cover ring-2 ring-gray-200' 
                        src={item.userData.image} 
                        alt={item.userData.name}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.userData.name}</p>
                      <p className="text-xs text-gray-500">Patient ID: {item.userData._id?.slice(-6) || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{calculateAge(item.userData.dob)} yrs</p>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-900">{slotDateFormat(item.slotDate)}</p>
                    <p className="text-xs text-blue-600 font-medium">{item.slotTime}</p>
                  </div>
                  
                  <div className='flex items-center gap-3'>
                    <img 
                      className='w-10 h-10 rounded-full object-cover ring-2 ring-blue-200' 
                      src={item.docData.image} 
                      alt={item.docData.name}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.docData.name}</p>
                      <p className="text-xs text-gray-500">{item.docData.speciality || 'Doctor'}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm font-semibold text-green-600">{currency}{item.amount}</p>
                  
                  <div className="flex items-center">
                    {getStatusBadge(item)}
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="lg:hidden bg-white border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          className='w-12 h-12 rounded-full object-cover ring-2 ring-gray-200' 
                          src={item.userData.image} 
                          alt={item.userData.name}
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-900">{item.userData.name}</p>
                        <p className="text-sm text-gray-500">{calculateAge(item.userData.dob)} years old</p>
                      </div>
                    </div>
                    {getStatusBadge(item)}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-3 3v11a2 2 0 002 2h8a2 2 0 002-2V10l-3-3" />
                        </svg>
                        <span className="text-sm text-gray-600">{slotDateFormat(item.slotDate)} at {item.slotTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          className='w-8 h-8 rounded-full object-cover' 
                          src={item.docData.image} 
                          alt={item.docData.name}
                        />
                        <span className="text-sm text-gray-600">Dr. {item.docData.name}</span>
                      </div>
                      <span className="text-base font-semibold text-green-600">{currency}{item.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AllAppointment