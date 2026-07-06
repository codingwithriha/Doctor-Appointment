import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
// import { assets } from "../../assets/assets_admin/assets";

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    if (a.slotDate === b.slotDate) {
      return a.slotTime.localeCompare(b.slotTime);
    }
    return new Date(a.slotDate.replace(/_/g, '-')) - new Date(b.slotDate.replace(/_/g, '-'));
  });

  const getStatusBadge = (item) => {
    if (item.cancelled) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Cancelled
        </span>
      );
    }
    if (item.isCompleted) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Scheduled
      </span>
    );
  };

  const getPaymentBadge = (payment) => {
    if (payment) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
          Online
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
        Cash
      </span>
    );
  };

  const formatDate = (slotDate) => {
    const today = new Date();
    const appointmentDate = new Date(slotDate.replace(/_/g, '-'));
    const diffTime = appointmentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { formatted: slotDateFormat(slotDate), badge: 'Today', badgeColor: 'bg-green-100 text-green-800' };
    if (diffDays === 1) return { formatted: slotDateFormat(slotDate), badge: 'Tomorrow', badgeColor: 'bg-blue-100 text-blue-800' };
    if (diffDays > 0 && diffDays <= 7) return { formatted: slotDateFormat(slotDate), badge: `${diffDays}d`, badgeColor: 'bg-yellow-100 text-yellow-800' };
    return { formatted: slotDateFormat(slotDate), badge: null, badgeColor: '' };
  };

  const getAppointmentStats = () => {
    const total = sortedAppointments.length;
    const completed = sortedAppointments.filter(apt => apt.isCompleted).length;
    const cancelled = sortedAppointments.filter(apt => apt.cancelled).length;
    const scheduled = total - completed - cancelled;
    
    return { total, completed, cancelled, scheduled };
  };

  const stats = getAppointmentStats();

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Patient Appointments</h1>
        <p className="text-gray-600 mb-4">Manage and track your patient appointments</p>
        
        {/* Statistics */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 min-w-[120px]">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 min-w-[120px]">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <p className="text-lg font-semibold text-gray-900">{stats.scheduled}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 min-w-[120px]">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-lg font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 min-w-[120px]">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                <p className="text-lg font-semibold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-[0.5fr_2.5fr_1.2fr_0.8fr_2.5fr_1fr_1.5fr] bg-gray-50 py-4 px-6 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-700">#</p>
          <p className="text-sm font-semibold text-gray-700">Patient</p>
          <p className="text-sm font-semibold text-gray-700">Payment</p>
          <p className="text-sm font-semibold text-gray-700">Age</p>
          <p className="text-sm font-semibold text-gray-700">Date & Time</p>
          <p className="text-sm font-semibold text-gray-700">Fee</p>
          <p className="text-sm font-semibold text-gray-700">Actions</p>
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
              <p className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</p>
              <p className="text-sm text-gray-500">Patient appointments will appear here once booked</p>
            </div>
          ) : (
            sortedAppointments.map((item, index) => {
              const dateInfo = formatDate(item.slotDate);
              
              return (
                <div key={index}>
                  {/* Desktop Row */}
                  <div className="hidden lg:grid grid-cols-[0.5fr_2.5fr_1.2fr_0.8fr_2.5fr_1fr_1.5fr] items-center py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                    <p className="text-sm font-medium text-gray-900">{index + 1}</p>
                    
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200" 
                          src={item.userData.image} 
                          alt={item.userData.name}
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.userData.name}</p>
                        <p className="text-xs text-gray-500">ID: {item.userData._id?.slice(-6) || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div>{getPaymentBadge(item.payment)}</div>
                    
                    <p className="text-sm text-gray-600">{calculateAge(item.userData.dob)} yrs</p>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{dateInfo.formatted}</p>
                        {dateInfo.badge && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${dateInfo.badgeColor}`}>
                            {dateInfo.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-600 font-medium">{item.slotTime}</p>
                    </div>
                    
                    <p className="text-sm font-semibold text-green-600">{currency}{item.amount}</p>
                    
                    <div className="flex items-center gap-2">
                      {!item.cancelled && !item.isCompleted ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => completeAppointment(item._id)}
                            className="inline-flex items-center p-2 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 transition-colors duration-200 border border-green-200"
                            title="Mark as completed"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="inline-flex items-center p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200 border border-red-200"
                            title="Cancel appointment"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        getStatusBadge(item)
                      )}
                    </div>
                  </div>

                  {/* Mobile Card */}
                  <div className="lg:hidden bg-white border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200" 
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
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Payment</p>
                        {getPaymentBadge(item.payment)}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Fee</p>
                        <p className="text-sm font-semibold text-green-600">{currency}{item.amount}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{dateInfo.formatted}</p>
                        <span className="text-sm text-blue-600">{item.slotTime}</span>
                        {dateInfo.badge && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${dateInfo.badgeColor}`}>
                            {dateInfo.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {!item.cancelled && !item.isCompleted && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => completeAppointment(item._id)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 transition-colors duration-200 border border-green-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Complete
                        </button>
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200 border border-red-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;