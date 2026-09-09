import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const DashboardButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      className={cn(
        "absolute top-4 right-4 py-1 px-3 rounded-md shadow transition",
        className
      )}
      onClick={() => navigate("/")}
    >
      Dashboard
    </button>
  );
};

export default DashboardButton;
