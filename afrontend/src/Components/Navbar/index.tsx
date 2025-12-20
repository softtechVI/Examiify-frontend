import React from "react";
import { Link } from "react-router-dom";



// !bg-[#049F99] !border-none hover:!bg-[#337774]
const Navbar: React.FC = () => {
  return (  // !bg-[#1E3F69] !border-none hover:!bg-[#337774]
    <>
    <header className="text-white p-4" >
    {/* <header className="bg-blue-800 text-white p-4 shadow-md"> */}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          {/* <Link to="/">Examify</Link> */}
            <img src="/logo2.png" alt="Logo" className="h-10" />
        </h1>

        {/* Navigation Links */}
        <nav className="space-x-6">
          <Link to="/" className="hover:underline text-[#049F99] font-semibold">
            Home
          </Link>
          <Link to="/about" className="hover:underline text-[#049F99] font-semibold">
            About
          </Link>
          <Link to="/contact" className="hover:underline text-[#049F99] font-semibold">
            Contact
          </Link>
          <Link
            to="/register"   
            className="!bg-[#049F99] !border-none hover:!bg-[#337774] text-white font-semibold px-4 py-1.5 rounded " // hover:bg-gray-200  // TEXT-BLUE-800
          >
            Join Now
          </Link>
        </nav>
      </div>
    </header>
    
    </>
  );
};

export default Navbar;

