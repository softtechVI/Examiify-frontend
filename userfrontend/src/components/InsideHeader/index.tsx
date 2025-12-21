import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dropdown, Menu, Button } from "antd";
import { User, Menu as MenuIcon, X } from "lucide-react";
import { logout } from "../../utils/checkauth";
import NotificationPanel from "../Notification/index"; // ✅ Import the new component

// ----------------- Main Header Component -----------------
const InsideHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = [
    { name: "Home", href: "/dashboard" },
    { name: "View Exam", href: "/view-exam" },
    { name: "Manage Rooms", href: "/manage-rooms" },
    { name: "Manage Students", href: "/manage-students" },
    { name: "Contact Us", href: "/contact" },
  ];

  const handleLogout = async () => {
    setLoading(true);
    try {
      const success = await logout();
      if (success) {
        sessionStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // User Dropdown Menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/profile")}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings">Settings</Menu.Item>
      <Menu.Item key="refer">Refer & Earn</Menu.Item>
      <Menu.Item key="ticket">Raise a Ticket</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" danger onClick={handleLogout}>
        {loading ? "Logging out..." : "Logout"}
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="flex items-center">
              <div className="flex items-center">
            <img src="/logo4.png" alt="Logo" className="h-10" />
          </div>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium ${
                  isActive(item.href)
                    ? "text-[#049F99] border-b-2 border-[#049F99]"
                    : "text-gray-500"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Component is now imported and used here */}
            <NotificationPanel />

            {/* User Dropdown */}
            <Dropdown overlay={userMenu} placement="bottomRight" trigger={["hover"]}>
              <div className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-[#049F99]">
                <User className="text-white h-5 w-5" />
              </div>
            </Dropdown>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              type="text"
              icon={mobileMenuOpen ? <X /> : <MenuIcon />}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2">
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-base font-medium ${
                    isActive(item.href) ? "text-[#049F99]" : "text-gray-500"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex space-x-2 mt-2">
                <div className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-[#049F99]">
                  <User className="text-white h-5 w-5" />
                </div>
                <NotificationPanel />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default InsideHeader;