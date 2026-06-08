
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dropdown, Menu, Button } from "antd";
import { User, Menu as MenuIcon, X, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import NotificationPanel from "../Notification/index";
import useSessionStore from "../../store/userSession";

const InsideHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { permissions, clearSession } = useSessionStore();

  // ── Direct links — hamesha dikhenge (no dropdown) ──
  const directLinks = [
    { name: "Home",       href: "/dashboard", permission: "manage_profile" },
    { name: "Contact Us", href: "/contact",   permission: "manage_profile" },
  ];

  // ── Dropdown links — permission filter hoga ──
  const allDropdownLinks = [
    { name: "Manage Exam",     href: "/manage-exam",     permission: "manage_exams"    },
    { name: "View Exam",       href: "/view-exam",       permission: "view_exam"       },
    { name: "Manage Rooms",    href: "/manage-rooms",    permission: "manage_rooms"    },
    { name: "Manage Students", href: "/manage-students", permission: "manage_students" },
    { name: "Manage Users",    href: "/manage-users",    permission: "manage_users"    },
    { name: "Manage Roles",    href: "/manage-roles",    permission: "manage_roles"    },
    { name: "View Results",    href: "/view-results",    permission: "view_results"    },
    { name: "View Reports",    href: "/view-reports",    permission: "view_reports"    },
    { name: "Attempt Exam",    href: "/attempt-exam",    permission: "attempt_exams"   },
    { name: "Manage Plans",    href: "/manage-plans",    permission: "manage_plans"    },
    { name: "Manage Coupons",  href: "/manage-coupons",  permission: "manage_coupons"  },
    { name: "Manage AI",       href: "/manage-ai",       permission: "manage_ai"       },
    { name: "Settings",        href: "/manage-settings", permission: "manage_settings" },
  ];

  // Sirf allowed dropdown links
  const dropdownLinks = allDropdownLinks.filter((item) =>
    permissions.includes(item.permission)
  );

  const { logout } = useAuth();   

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();             
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // ── Pages Dropdown Menu ───────────────────────────────
  const pagesMenu = (
    <Menu className="min-w-[200px] rounded-xl shadow-lg border border-gray-100 py-1">
      {dropdownLinks.map((item) => (
        <Menu.Item
          key={item.href}
          className={`mx-1 my-0.5 rounded-lg ${
            isActive(item.href) ? "bg-[#049F99]/10" : ""
          }`}
        >
          <Link
            to={item.href}
            className={`flex items-center gap-2 text-sm font-medium ${
              isActive(item.href) ? "text-[#049F99]" : "text-gray-600"
            }`}
          >
            {isActive(item.href) && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#049F99] inline-block" />
            )}
            {item.name}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  // ── User Dropdown Menu ────────────────────────────────
  const userMenu = (
    <Menu className="min-w-[180px] rounded-xl shadow-lg border border-gray-100 py-1">
      <Menu.Item key="profile" onClick={() => navigate("/profile")}
        className="mx-1 my-0.5 rounded-lg text-sm text-gray-600"
      >
        Profile
      </Menu.Item>
      <Menu.Item key="settings"
        className="mx-1 my-0.5 rounded-lg text-sm text-gray-600"
      >
        Settings
      </Menu.Item>
      <Menu.Item key="refer"
        className="mx-1 my-0.5 rounded-lg text-sm text-gray-600"
      >
        Refer & Earn
      </Menu.Item>
      <Menu.Item key="ticket"
        className="mx-1 my-0.5 rounded-lg text-sm text-gray-600"
      >
        Raise a Ticket
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" danger onClick={handleLogout}
        className="mx-1 my-0.5 rounded-lg text-sm"
      >
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
              <img src="/logo4.png" alt="Logo" className="h-10" />
            </Link>
          </div>

          {/* ── Desktop Navigation ── */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-1">

            {/* Direct Links — Home & Contact */}
            {directLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-[#049F99] bg-[#049F99]/10"
                    : "text-gray-600 hover:text-[#049F99] hover:bg-[#049F99]/5"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Pages Dropdown — sirf agar koi permission wala link hai */}
            {dropdownLinks.length > 0 && (
              <Dropdown
                overlay={pagesMenu}
                placement="bottomCenter"
                trigger={["hover"]}
              >
                <button
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    dropdownLinks.some((i) => isActive(i.href))
                      ? "text-[#049F99] bg-[#049F99]/10"
                      : "text-gray-600 hover:text-[#049F99] hover:bg-[#049F99]/5"
                  }`}
                >
                  Pages
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </Dropdown>
            )}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-3">
            <NotificationPanel />
            <Dropdown overlay={userMenu} placement="bottomRight" trigger={["hover"]}>
              <div className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#049F99]/30 hover:bg-[#049F99]/5 transition-all duration-200">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#049F99]">
                  <User className="text-white h-4 w-4" />
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
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

        {/* ── Mobile Navigation ── */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 pb-3">
            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">

              {/* Direct Links */}
              {directLinks.map((item, index) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-gray-100 transition-colors ${
                    isActive(item.href)
                      ? "text-[#049F99] bg-[#049F99]/10"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isActive(item.href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#049F99]" />
                  )}
                  {item.name}
                </Link>
              ))}

              {/* Dropdown Links */}
              {dropdownLinks.map((item, index) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
                    ${index !== dropdownLinks.length - 1 ? "border-b border-gray-100" : ""}
                    ${isActive(item.href)
                      ? "text-[#049F99] bg-[#049F99]/10"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isActive(item.href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#049F99]" />
                  )}
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Bottom Actions */}
            <div className="flex items-center gap-3 mt-3 px-1">
              <div className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full bg-[#049F99]">
                <User className="text-white h-4 w-4" />
              </div>
              <NotificationPanel />
              <button
                onClick={handleLogout}
                className="ml-auto text-sm text-red-500 font-medium px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default InsideHeader;