// import { Link, useLocation } from 'react-router-dom'; // ✅ Import useLocation
// import {
//   HomeOutlined,
//   PlusOutlined,
//   BookOutlined,
//   FileDoneOutlined,
//   UsergroupDeleteOutlined,
//   SettingOutlined,
//   LogoutOutlined
// } from '@ant-design/icons';


// function Dashboard() {
//   const location = useLocation(); // ✅ Get current location

//   const menuItems = [
//     { icon: <HomeOutlined />, label: 'Dashboard', path: '/admindashboard' },
//     { icon: <PlusOutlined />, label: 'Add Plan', path: '/add-plan' },
//     { icon: <PlusOutlined />, label: 'Add Coupon', path: '/add-coupon' },
//     { icon: <FileDoneOutlined />, label: 'Check Institutes', path: '/' },
//     { icon: <BookOutlined />, label: 'Manage Exams', path: '/' },
//     { icon: <UsergroupDeleteOutlined />, label: 'Manage Users', path: '/' },
//     { icon: <BookOutlined />, label: 'Reports', path: '/' },
//     { icon: <SettingOutlined />, label: 'Settings', path: '/' },
//     { icon: <LogoutOutlined />, label: 'Logout', path: '/logout', isLogout: true }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white p-4">
//         <div className="flex justify-center mb-4">
//           <img src="/logo5.png" alt="Logo" className="h-20" />
//         </div>
//         <div className="border-t-2 border-gray-300 mb-4"></div>

//         <nav className="space-y-2">
//           {menuItems.map((item, idx) => {
//             const isActive = location.pathname === item.path; // ✅ Check if this is the active route

//             return (
//               <Link
//                 to={item.path}
//                 key={idx}
//                 className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition duration-200 ${
//                   isActive ? 'bg-[#049F99] text-white' : 'text-gray-700 hover:bg-[#049F99] hover:text-white'
//                 } ${item.isLogout ? 'text-red-600 hover:text-white' : ''}`}
//               >
//                 {item.icon}
//                 <span>{item.label}</span>
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//     </div>
//   );
// }

// export default Dashboard;

import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import {
  HomeOutlined,
  PlusOutlined,
  BookOutlined,
  FileDoneOutlined,
  UsergroupDeleteOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import { logout } from '../../utils/checkauth';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try{
      const success = await logout();
      if (success) {
        sessionStorage.clear();
        navigate("/login");
      }
    }catch (error) {
      console.error("Error logging out:", error);
    }finally {
      setLoading(false);
    }
  };



  const menuItems = [
    { icon: <HomeOutlined />, label: 'Dashboard', path: '/admindashboard' },
    { icon: <PlusOutlined />, label: 'Add Plan', path: '/add-plan' },
    { icon: <PlusOutlined />, label: 'Add Coupon', path: '/add-coupon' },
    { icon: <PlusOutlined />, label :'Ai Pricing' ,path :'/aiPricing'},
    { icon: <FileDoneOutlined />, label: 'Check Institutes', path: '/' },
    { icon: <BookOutlined />, label: 'Manage Exams', path: '/' },
    { icon: <UsergroupDeleteOutlined />, label: 'Manage Users', path: '/' },
    { icon: <BookOutlined />, label: 'Reports', path: '/' },
    { icon: <SettingOutlined />, label: 'Settings', path: '/' },
    { icon: <LogoutOutlined />, label: 'Logout', isLogout: true }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4">
        <div className="flex justify-center mb-4">
          <img src="/logo5.png" alt="Logo" className="h-20" />
        </div>
        <div className="border-t-2 border-gray-300 mb-4"></div>

        <nav className="space-y-2">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;

            if (item.isLogout) {
              return (
                <button
                  key={idx}
                  onClick={handleLogout}
                  disabled={loading}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition duration-200 text-red-600 hover:bg-[#049F99] hover:text-white`}
                >
                  {item.icon}
                  <span>{loading ? "Logging out..." : item.label}</span>
                </button>
              );
            }

            return (
              <Link
                to={item.path ?? '/'}
                key={idx}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition duration-200 ${
                  isActive ? 'bg-[#049F99] text-white' : 'text-gray-700 hover:bg-[#049F99] hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}

export default Dashboard;
