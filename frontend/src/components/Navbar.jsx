import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "All Doctors", path: "/doctors" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const logoutFunc = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 bg-white sticky top-0 z-50">
      <Link to="/">
        <img className="w-44 cursor-pointer" src={assets.logo} alt="" />
      </Link>
      <ul className="hidden md:flex items-start gap-5 font-medium uppercase">
        {navLinks.map((nav, index) => (
          <NavLink key={index} to={nav.path}>
            <li className="py-1">{nav.title}</li>
            <hr className="hidden border-none outline-none h-0.5 bg-primary w-3/5 m-auto" />
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        {token && userData ? (
          <div
            className="flex items-center gap-2 cursor-pointer group relative"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <img
              className="w-8 rounded-full"
              src={userData.image || assets.upload_area}
              alt="user profile pic"
            />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div
              className={`${
                openDropdown ? "block" : "hidden"
              } absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20`}
            >
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={logoutFunc}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Login
          </button>
        )}

        {/* ----------- Mobile Menu ------------- */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 cursor-pointer md:hidden"
          src={assets.menu_icon}
          alt="menu icon"
        />
        <div
          className={`${showMenu ? "fixed w-full" : "h-0 w-0"} 
          md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-300`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <Link onClick={() => setShowMenu(false)} to="/">
              <img className="w-36" src={assets.logo} />
            </Link>
            <img
              className="w-7 cursor-pointer"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="cross icon"
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            {navLinks.map((nav, index) => (
              <NavLink
                onClick={() => setShowMenu(false)}
                key={index}
                to={nav.path}
              >
                <p className="px-4 py-2 rounded inline-block">{nav.title}</p>
              </NavLink>
            ))}

            {/* ----- Login button for mobile device ----- */}
            {!token && (
              <li className="">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/login");
                  }}
                  className={`px-6 py-2 rounded ${
                    location.pathname === "/login"
                      ? "bg-primary text-white"
                      : "bg-transparent text-black"
                  }`}
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;