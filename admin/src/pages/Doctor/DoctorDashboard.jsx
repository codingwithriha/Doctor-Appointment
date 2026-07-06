import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets_admin/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const { dashData, setDashData, completeAppointment, getDashData, cancelAppointment, dToken } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  const StatCard = ({ icon, value, label, index }) => (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 w-20 h-20 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
            <img className="w-6 h-6 opacity-80" src={icon} alt={label} />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
              {label === "Earnings" ? `${currency}${value}` : value}
            </div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">
              {label}
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          Active
        </div>
      </div>
    </div>
  );

  const AppointmentCard = ({ item, index }) => (
    <div className="group flex items-center p-4 hover:bg-gray-50 transition-all duration-200 rounded-lg">
      <div className="relative">
        <img
          className="w-11 h-11 rounded-full object-cover"
          src={item.userData.image}
          alt={item.userData.name}
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"></div>
      </div>
      
      <div className="flex-1 ml-4">
        <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
          {item.userData.name}
        </div>
        <div className="text-sm text-gray-500 flex items-center mt-0.5">
          <svg className="w-3.5 h-3.5 mr-1.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {slotDateFormat(item.slotDate)}
        </div>
      </div>
      
      <div className="flex items-center">
        {item.cancelled ? (
          <div className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-200">
            Cancelled
          </div>
        ) : item.isCompleted ? (
          <div className="px-3 py-1.5 bg-green-50 text-green-600 text-xs font-semibold rounded-full border border-green-200">
            Completed
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => cancelAppointment(item._id)}
              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all duration-200 group/btn"
              title="Cancel Appointment"
            >
              <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={() => completeAppointment(item._id)}
              className="p-2 hover:bg-green-50 text-gray-400 hover:text-green-500 rounded-lg transition-all duration-200 group/btn"
              title="Complete Appointment"
            >
              <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    dashData && (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Monitor your practice performance and manage appointments efficiently
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={assets.earning_icon}
              value={dashData.earnings}
              label="Earnings"
              index={0}
            />
            <StatCard
              icon={assets.appointments_icon}
              value={dashData.appointments}
              label="Appointments"
              index={1}
            />
            <StatCard
              icon={assets.patients_icon}
              value={dashData.patients}
              label="Patients"
              index={2}
            />
          </div>

          {/* Latest Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Latest Appointments</h2>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">
                  {dashData.latestAppointments.length} Total
                </span>
              </div>
            </div>

            {/* Appointments List */}
            <div className="divide-y divide-gray-100">
              {dashData.latestAppointments.length > 0 ? (
                dashData.latestAppointments.map((item, index) => (
                  <AppointmentCard key={item._id || index} item={item} index={index} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No appointments scheduled</h3>
                  <p className="text-gray-500">Your upcoming appointments will appear here when patients book with you.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;