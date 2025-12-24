import { useNavigate } from "react-router-dom";

const DashboardButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      className={`absolute top-4 right-4 py-1 px-3 rounded-md shadow bg-white text-teal-500 hover:bg-gray-100 ${className}`}
      onClick={() => navigate("/")}
    >
      Dashboard
    </button>
  );
};

export default DashboardButton;
