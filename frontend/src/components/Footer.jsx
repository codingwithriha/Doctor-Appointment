import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/assets_frontend/logo.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/*----Left Section-----*/}
        <div>
          <img className="mb-5 w-40" src={logo} alt="CodingWithRihan Logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Prescripto connects you with trusted doctors and makes booking
            appointments simple and stress-free. Manage your healthcare, on your
            schedule, from anywhere.
          </p>
        </div>

        {/*----Center Section-----*/}
        <div>
          <p className="text-xl font-medium mb-5">Company</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <Link
                to="/"
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-black transition-all"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-black transition-all"
              >
                About us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-black transition-all"
              >
                Contact us
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-black transition-all"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/*----Right Section-----*/}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+1-212-456-7890</li>
            <li>codingwithriha@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        {/*---CopyRight text----*/}
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright © {currentYear}{" "}
          <a
            href="https://riha-shahzadi.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
          >
            codingwithriha
          </a>{" "}
          - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
