import React from 'react'
import groupProfiles from '../assets/assets_frontend/group_profiles.png'
import arrowIcon from '../assets/assets_frontend/arrow_icon.svg'
import headerImage from '../assets/assets_frontend/header_img.png'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20'>
        {/* ------Left Side------*/}
        <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 md:py-[10vh] md:mb-[-30px]'>
            <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
              Book Appointment<br/> with Trusted doctors
            </p>
            <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
              <img className='w-28' src={groupProfiles} alt="" />
              <p>
                Simply browse through our extensive list of trusted doctors,<br className='hidden sm:block'/>
                schedule your appointment hassle-free.
              </p>
            </div>
            <a href="#speciality" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm hover:scale-105 transition-all duration-300'>
              Book Appointments
              <img className='w-3' src={arrowIcon} alt="" />
            </a>
        </div>

        {/* ------Right Side------*/}
        <div className='md:w-1/2 relative'>
            <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={headerImage} alt="" />
        </div>
    </div>
  )
}

export default Header
