import  { FC } from "react";
import { Link } from "react-router-dom";
import bgIllustration from '../assets/cloud.png'; // cloud + pot
import person from "../assets/perosn.png"; // person only

const NotFound: FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between h-screen w-full bg-white px-8 md:px-20 relative overflow-hidden">
      {/* LEFT SIDE */}
      <div className="md:w-1/2 text-left z-20">
        <h1 className="text-5xl font-extrabold text-gray-900">Page 404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-2">Not Found</h2>
        <p className="text-gray-500 mt-4 max-w-md">
          The page you are looking for might have been removed from Examify, had its name
          changed, or is temporarily unavailable. Don’t worry, you can always go
          back to your dashboard.
        </p>
        <Link
          to="/dashboard"
          className="inline-block mt-6 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="md:w-1/2 flex justify-center mt-10 md:mt-0 relative z-20">
        {/* Big 404 */}
        <h1 className="text-[6rem] md:text-[10rem] font-extrabold text-teal-500 relative z-20">
          404
        </h1>
      </div>

      {/* BACKGROUND CLOUD + POT */}
      <img
        src={bgIllustration}
        alt="404 Background"
        className="absolute ml-150 mb-25 left-0 w-[60%] md:w-[50%] h-[50%] object-contain opacity-90 z-10"
      />

      {/* PERSON IMAGE */}
      <img
        src={person}
        alt="Person Illustration"
        className="absolute right-1 w-[10%] md:w-[25%] h-[45%] mb-27 object-contain z-20"
      />
    </div>
  );
};

export default NotFound;
