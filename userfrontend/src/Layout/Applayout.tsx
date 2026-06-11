import React from "react";
import { Outlet } from "react-router-dom";
import InsideHeader from "@/components/InsideHeader";
import Footer from "@/components/Footer";

const UserLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <header className="sticky top-0 left-0 w-full z-50">
        <InsideHeader />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start mt-0">
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;

