import React from 'react';
// import { Link, useLocation } from 'react-router-dom'; 
import Header from '../Components/Admin Navbar/index';
import { Divider } from 'antd';
import {
  HomeOutlined,
  PlusOutlined,
  BookOutlined,
} from '@ant-design/icons';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <>
        <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar / Header */}
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md z-30 transition-transform duration-300 fixed md:static top-0 left-0 h-full w-64 
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => {
          if (window.innerWidth < 768) {
            e.preventDefault();
            setSidebarOpen(false);
          }
        }}
      >
        <div className="flex flex-col h-full sc">
          {/* Sidebar Header with Close Button */}
          <div className="flex justify-between items-center p-4 md:hidden">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(false);
              }}
              className="text-2xl font-bold"
            >
              &times;
            </button>
          </div>

          {/* Sidebar Items */}
          <div
            className="flex-1 overflow-auto p-4 space-y-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onClick={() => {
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
            }}
          >
            <Header />
          </div>
        </div>
      </div>
          {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center mb-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(true);
            }}
            className="text-3xl text-gray-700 focus:outline-none"
          >
            &#9776;
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800">Welcome to the Dashboard</h1>
        <Divider />

        {/* Summary Cards */}
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="bg-white shadow-md rounded-xl w-64 h-40 p-6 cursor-pointer">
            <div>
              <span className="text-4xl text-[#049F99]">
                <HomeOutlined />
              </span>
              <span className="font-semibold text-4xl pl-5">25</span>
              <p className="text-[#049F99] mt-2 font-bold text-xl">Total Institute</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl w-64 h-40 p-6 cursor-pointer">
            <div>
              <span className="text-4xl text-[#049F99]">
                <PlusOutlined />
              </span>
              <span className="font-semibold text-4xl pl-5">25</span>
              <p className="text-[#049F99] mt-2 font-bold text-xl">Add Plan</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl w-64 h-40 p-6 cursor-pointer">
            <div>
              <span className="text-4xl text-[#049F99]">
                <BookOutlined />
              </span>
              <span className="font-semibold text-4xl pl-5">25</span>
              <p className="text-[#049F99] mt-2 font-bold text-xl">Exams Conduct</p>
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
}

export default Dashboard;
