import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import verified_icon from '../assets/assets_frontend/verified_icon.svg';
import info_icon from '../assets/assets_frontend/info_icon.svg';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocInfo = async () => {
    setLoading(true);
    setError('');
    
    try {
      // console.log('Fetching doctor info for docId:', docId);
      // console.log('Available doctors in context:', doctors.length);
      
      // First try to get from context
      const contextDocInfo = doctors.find(doc => doc._id === docId);
      // console.log('Doctor found in context:', !!contextDocInfo);
      
      if (contextDocInfo) {
        // console.log('Context doctor available status:', contextDocInfo.available);
        setDocInfo(contextDocInfo);
      }
      
      // Always fetch fresh data from API to ensure we have latest information
      // console.log('Fetching fresh data from API...');
      const { data } = await axios.get(backendUrl + `/api/user/doctor/${docId}`);
      
      if (data.success) {
        // console.log('API response successful');
        // console.log('API doctor available status:', data.doctor.available);
        // console.log('API doctor slots_booked:', data.doctor.slots_booked);
        setDocInfo(data.doctor);
        setError('');
      } else {
        // console.log('API response failed:', data.message);
        setError(data.message || 'Failed to fetch doctor information');
        
        // If API fails but we have context data, use it
        if (contextDocInfo) {
          setDocInfo(contextDocInfo);
        }
      }
    } catch (error) {
      console.error('Error fetching fresh doctor data:', error);
      setError('Network error while fetching doctor information');
      
      // Fallback to context data if API fails
      const contextDocInfo = doctors.find(doc => doc._id === docId);
      if (contextDocInfo) {
        // console.log('Using fallback context data');
        setDocInfo(contextDocInfo);
      } else {
        // console.log('No context data available for fallback');
        setError('Doctor not found');
      }
    } finally {
      setLoading(false);
    }
  };

  // Normalize time format for consistent comparison
  const normalizeTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.toLowerCase().replace(/\s+/g, '').replace(/^0/, '');
  };

  const getAvailableSlot = async () => {
    if (!docInfo) {
      // console.log('No doctor info available for slot generation');
      return;
    }

    // console.log('Getting available slots for doctor:', docInfo.name);
    // console.log('Doctor available status:', docInfo.available);

    // Check if doctor is available first
    if (docInfo.available === false) {
      // console.log('Doctor is not available - no slots will be generated');
      setDocSlot([]);
      return;
    }

    // console.log('Doctor slots_booked:', docInfo.slots_booked);

    const slotsBooked = docInfo.slots_booked || {};
    let allSlots = [];
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = day + "_" + month + "_" + year;

        // Get booked times for this date
        const bookedTimesForDate = slotsBooked[slotDate] || [];
        
        // Normalize both the current time and booked times for comparison
        const normalizedCurrentTime = normalizeTime(formattedTime);
        const normalizedBookedTimes = bookedTimesForDate.map(time => normalizeTime(time));

        const isSlotAvailable = !normalizedBookedTimes.includes(normalizedCurrentTime);

        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      // Only add days that have available slots
      if (timeSlots.length > 0) {
        allSlots.push(timeSlots);
      }
    }

    // console.log('Generated available slots count:', allSlots.length);
    setDocSlot(allSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate('/login');
    }

    // Check if doctor is available before proceeding
    if (docInfo.available === false) {
      toast.error("Doctor is not available for appointments");
      return;
    }

    if (!slotTime) {
      toast.warn("Please select a time slot");
      return;
    }

    try {
      const date = docSlot[slotIndex][0].dateTime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + "_" + month + "_" + year;

      // console.log('Attempting to book appointment:', { docId, slotDate, slotTime });

      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        
        // Immediately update the local doctor info with the booked slot
        const updatedDocInfo = { ...docInfo };
        if (!updatedDocInfo.slots_booked) {
          updatedDocInfo.slots_booked = {};
        }
        if (!updatedDocInfo.slots_booked[slotDate]) {
          updatedDocInfo.slots_booked[slotDate] = [];
        }
        updatedDocInfo.slots_booked[slotDate].push(slotTime);
        setDocInfo(updatedDocInfo);
        
        // Reset selections
        setSlotTime("");
        setSlotIndex(0);
        
        // Refresh doctors data in background
        getDoctorsData();
        
        // Navigate to appointments page
        navigate('/my-appointment');
      } else {
        ('Booking failed:', data.message);
        toast.error(data.message);
        
        // If doctor became unavailable, refresh the doctor info
        if (data.message.toLowerCase().includes("not available")) {
          // console.log('Doctor became unavailable, refreshing info...');
          await fetchDocInfo();
        }
      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      
      // If it's an availability error, refresh the doctor info
      if (errorMessage.toLowerCase().includes("not available")) {
        // console.log('Availability error detected, refreshing info...');
        await fetchDocInfo();
      }
    }
  };

  useEffect(() => {
    // console.log('useEffect triggered - doctors or docId changed');
    // console.log('Doctors count:', doctors.length);
    // console.log('Current docId:', docId);
    
    if (docId && doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    // console.log('useEffect triggered - docInfo changed');
    // console.log('Current docInfo:', docInfo ? { name: docInfo.name, available: docInfo.available } : 'null');
    
    if (docInfo) {
      // Reset slot selection when doctor info changes
      setSlotTime("");
      setSlotIndex(0);
      getAvailableSlot();
    }
  }, [docInfo]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading doctor information...</p>
      </div>
    );
  }

  // Error state
  if (error && !docInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchDocInfo}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If doctor info is not available
  if (!docInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Doctor not found</p>
      </div>
    );
  }

  // If doctor is not available
  if (docInfo.available === false) {
    return (
      <div>
        {/*----DoctorsDetails----  */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
          </div>

          <div className='flex-1 border border-gray-400 rounded-lg p-8 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {docInfo.name} <img className='w-5' src={verified_icon} alt="" />
            </p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            </div>
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                About <img src={info_icon} alt="" />
              </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
            </p>
            
            {/* Doctor unavailable message */}
            <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-700 font-medium'>🚫 Doctor is currently not available for appointments</p>
              <p className='text-red-600 text-sm mt-1'>Please check back later or select another doctor.</p>
            </div>
          </div>
        </div>

        <div className='sm:ml-72 sm:pl-4 mt-4'>
          <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/*----DoctorsDetails----  */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name} <img className='w-5' src={verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* ---Booking slots ----  */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>



        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlot.length > 0 ? docSlot.map((item, index) => (
              <div 
                onClick={() => {
                  setSlotIndex(index);
                  setSlotTime(''); // Reset time selection when date changes
                }} 
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} 
                key={index}
              >
                <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            )) : (
              <div className='text-center py-6 px-4'>
                <p className='text-gray-400'>
                  {docInfo.available === false 
                    ? 'Doctor is not available for appointments' 
                    : 'No available slots for the next 7 days'
                  }
                </p>
              </div>
            )
          }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlot.length > 0 && docSlot[slotIndex] && docSlot[slotIndex].map((item, index) => (
            <p 
              onClick={() => setSlotTime(item.time)} 
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} 
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
          {docSlot.length > 0 && docSlot[slotIndex] && docSlot[slotIndex].length === 0 && (
            <p className='text-gray-400'>No available time slots for this day</p>
          )}
        </div>

        <button 
          onClick={bookAppointment} 
          disabled={!slotTime || docInfo.available === false}
          className={`text-sm font-light px-14 py-3 rounded-full my-6 ${(slotTime && docInfo.available !== false) ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {docInfo.available === false ? 'Doctor Not Available' : (slotTime ? 'Book an Appointment' : 'Select a Time Slot')}
        </button>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    </div>
  );
};

export default Appointment;