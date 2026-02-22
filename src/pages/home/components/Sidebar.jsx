import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBars } from 'react-icons/fa';
import SidebarItems from './SidebarItems';
import logo from '../../../assets/images/Container (1).png';
import { LuLayoutDashboard } from "react-icons/lu";
import { TbUsers } from "react-icons/tb";
import { IoCallOutline } from "react-icons/io5";
import { TbHeartRateMonitor } from "react-icons/tb";
import { CiSettings } from 'react-icons/ci';
import { logout, logoutApi } from '../../../redux/slices/AuthSlice/authReducer';
import { useSelector } from 'react-redux';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(logoutApi(token));
    navigate('/login');
  };

  return (
    <div
      className={`h-screen bg-white text-gray-200 flex flex-col p-5 shadow-lg transition-width duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >

      {isOpen && (
        <div className="flex items-center gap-3 mb-4">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <h1 className="text-lg font-bold text-gray-800">EstatePilot CRM</h1>
        </div>
      )}

    
      <button
        onClick={toggleSidebar}
        className="mb-6 text-gray-800 hover:text-gray-600 focus:outline-none"
      >
        <FaBars size={20} />
      </button>


      <SidebarItems icon={<LuLayoutDashboard />} label="Dashboard" isOpen={isOpen} onClick={() => navigate('/')} />
      <SidebarItems icon={<TbUsers />} label="Leads" isOpen={isOpen} onClick={() => navigate('/leads')} />
      <SidebarItems icon={<IoCallOutline />} label="Call Logs" isOpen={isOpen} onClick={()=>navigate('/calllogs')}/>
      <SidebarItems icon={<TbHeartRateMonitor />} label="Ai Monitoring" isOpen={isOpen} />
      <SidebarItems icon={<CiSettings size={20}/>} label="Setting" isOpen={isOpen} />
      <SidebarItems icon={<FaSignOutAlt />} label="Logout" isOpen={isOpen} onClick={handleLogout} />


     


    </div>
  );
};

export default SideBar;
