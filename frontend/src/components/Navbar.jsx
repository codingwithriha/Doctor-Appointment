import React, { useContext, useState } from "react";
import logo from "../assets/assets_frontend/logo.svg";
import dropDownIcon from "../assets/assets_frontend/dropdown_icon.svg";
import menu_icon from "../assets/assets_frontend/menu_icon.svg";
import cross_icon from "../assets/assets_frontend/cross_icon.png";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { token, setToken, userData } = useContext(AppContext);

  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const logout = () => {
    setToken(false);
    setShowMenu(false);
    setShowProfileMenu(false);
    localStorage.removeItem("token");
  };

  const handleAdminPanel = () => {
    window.open("https://doctor-appointment-prescripto-admin.vercel.app/", "_blank");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={logo}
        alt="logo"
      />

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/" end className="nav-link">
          <li className="py-1">Home</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to="/doctors" className="nav-link">
          <li className="py-1">All Doctors</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to="/about" className="nav-link">
          <li className="py-1">About</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to="/contact" className="nav-link">
          <li className="py-1">Contact</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <li className="py-1 flex items-center">
          <button
            onClick={handleAdminPanel}
            className="bg-gradient-to-r from-primary to-primary text-white px-3 py-1.5 rounded-lg font-medium hover:from-primary hover:to-primary hover:shadow-lg transform hover:scale-105 transition-all duration-300 relative z-30 text-xs border border-transparent hover:border-white/20"
          >
             Admin
          </button>
        </li>
      </ul>

      <div className="flex items-center gap-4 relative">
        {token && userData ? (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={userData.image}
              alt="profile"
            />
            <img className="w-2.5" src={dropDownIcon} alt="dropdown" />
          </div>
        ) : (
          <>
            {/* Desktop Create Account Button */}
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
            >
              Create Account
            </button>
            
            {/* Mobile Create Account Button - shows in mobile menu */}
          </>
        )}

        {/* Profile Dropdown */}
        {showProfileMenu && (
          <div className="absolute top-14 right-0 text-base font-medium text-gray-600 z-20 bg-stone-100 rounded flex flex-col gap-4 p-4 min-w-[180px] whitespace-nowrap">
            <button
              onClick={() => {
                navigate("my-profile");
                setShowProfileMenu(false);
              }}
              className="hover:text-black cursor-pointer text-left w-full"
              type="button"
            >
              My Profile
            </button>
            <button
              onClick={() => {
                navigate("my-appointment");
                setShowProfileMenu(false);
              }}
              className="hover:text-black cursor-pointer text-left w-full"
              type="button"
            >
              My Appointment
            </button>
            <button
              onClick={logout}
              className="hover:text-black cursor-pointer text-left w-full"
              type="button"
            >
              Logout
            </button>
          </div>
        )}

        {/* ----Mobile Menu---- */}
        <img
          src={menu_icon}
          alt="menu"
          className="w-6 h-6 cursor-pointer block md:hidden"
          onClick={() => setShowMenu(true)}
        />

        <div
          className={`fixed top-0 right-0 bottom-0 z-20 bg-white transition-all duration-300 md:hidden ${
            showMenu ? "w-3/4 max-w-xs shadow-lg" : "w-0 overflow-hidden"
          }`}
          style={{ height: "100vh" }}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">Home</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>
            
            {/* Show Create Account button in mobile menu when not logged in */}
            {!token && (
              <li className="mt-4">
                <button
                  onClick={() => {
                    navigate("/login");
                    setShowMenu(false);
                  }}
                  className="bg-primary text-white px-6 py-2 rounded-full font-light"
                >
                  Create Account
                </button>
              </li>
            )}
            
            <li className="mt-4">
              <button
                onClick={() => {
                  handleAdminPanel();
                  setShowMenu(false);
                }}
                className="bg-gradient-to-r from-primary to-primary text-white px-2 py-2 rounded-lg font-medium hover:from-primary hover:to-primary hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm border border-transparent hover:border-white/20 w-full"
              >
                 ADMIN PANEL
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;