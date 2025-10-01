/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

const EmptyCustomerData = ({ title, subtitle, buttonText, link, image }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-center bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg shadow-lg overflow-hidden">
      <div className="relative w-64 h-64 mb-8">
        <img
          src={image}
          alt="Empty state"
          className="absolute inset-0 object-cover w-full h-full"
        />
      </div>
      <h2 className="text-3xl font-bold text-blue-800 mb-4 animate-fadeIn">
        {title}
      </h2>
      <p className="text-xl text-gray-600 mb-6 max-w-md animate-fadeIn animation-delay-200">
        {subtitle}
      </p>
      <Link
        to={link}
        className="group relative inline-flex items-center overflow-hidden rounded-full bg-blue-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-blue-500"
      >
        <span className="absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
        <span className="text-sm font-medium transition-all group-hover:mr-4">
          {buttonText}
        </span>
      </Link>
    </div>
  );
};

export default EmptyCustomerData;
