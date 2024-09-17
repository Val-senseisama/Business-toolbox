import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../css/Menu.css"; 
import logo from '../assets/images/business-toolbox-icon.png';
//import bell from "../assets/icons/bell.png";
import avatar from "../assets/icons/avatar.png";
import home from "../assets/icons/home.png";
import notes from '../assets/icons/notes.png';
import chat from '../assets/icons/chat.jpg';
import settings from '../assets/icons/setting.png';
import user3 from '../assets/icons/users3.png';
import project from '../assets/icons/projects.png';
import desktop from '../assets/icons/desktop.png';
import repo from '../assets/icons/repo.png';
import love from '../assets/icons/user-love.png';
import MenuItem from "./MenuItem";
import { useQuery } from "@apollo/client";
import Session from "../Helpers/Session";


interface MenuProps {
  userName: string;
  children: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({ userName, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useParams();

 
     
    const handleActive = (path: string) => {
        if ((location[ "*" ] === "dashboard" || "/")&& path === "home") {
            return true;
        } else if (location[ "*" ] === path) {
            return true;
        } else {
            return false;
        }
    }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

   return (
     <div className="menu-layout">
       {/* Top Bar */}
      
       {/* Side Bar */}
       <div className={`sidebar bg-white ${isSidebarOpen ? "open" : ""}`}>
         <div className="sidebar-content">
           <div className="sidebar-header">
             <Link to="/" className="navbar-brand mx-auto mb-5">
               <img
                 src={logo}
                 alt="Business Toolbox"
                 className="img-fluid"
                 height="30"
               />
             </Link>
             <button
               className="btn-close float-end d-lg-none"
               onClick={toggleSidebar}></button>
           </div>

           <div className="sidebar-body">
             <ul className="nav flex-column px-3">
               <li className="nav-item">
                 <MenuItem
                   path="home"
                   icon={home}
                   isActive={handleActive("home")}
                   allCaps={false}
                   onClick={() => setIsSidebarOpen(false)}
                 />
               </li>
               <li className="nav-item">
                 <MenuItem
                   path="front-desk"
                   icon={desktop}
                   isActive={handleActive("front-desk")}
                   allCaps={false}
                   onClick={() => setIsSidebarOpen(false)}
                 />
               </li>
               <li className="nav-item">
                 <MenuItem
                   path="crm"
                   icon={love}
                   isActive={handleActive("crm")}
                   allCaps={true}
                   onClick={() => setIsSidebarOpen(false)}
                 />
               </li>
               <li className="nav-item">
                 <MenuItem
                   path="hrm"
                   icon={user3}
                   isActive={handleActive("hrm")}
                   allCaps={true}
                   onClick={() => setIsSidebarOpen(false)}
                 />
               </li>
               <li className="nav-item">
                 <MenuItem
                   path="projects"
                   icon={project}
                   isActive={handleActive("projects")}
                   allCaps={false}
                   onClick={() => setIsSidebarOpen(false)}
                 />
               </li>
               <li className="nav-item">
                 <MenuItem
                   path="repository"
                   icon={repo}
                   isActive={handleActive("repository")}
                   allCaps={false}
                   onClick={() => setIsSidebarOpen(false)}
                 />
               </li>
               <li className="nav-item">
                 <MenuItem
                   path="assessment"
                   icon={notes}
                   isActive={handleActive("assessment")}
                   allCaps={false}
                   onClick={() => setIsSidebarOpen(false)}
                 />
               </li>
               <li className="nav-item">
                 <MenuItem
                   path="messages"
                   icon={chat}
                   isActive={handleActive("messages")}
                   allCaps={false}
                   onClick={() => setIsSidebarOpen(false)}
                 />
               </li>
             </ul>
           </div>
         </div>
         <div className="mx-2">
           <MenuItem
             path="settings"
             icon={settings}
             isActive={handleActive("settings")}
             allCaps={false}
             onClick={() => setIsSidebarOpen(false)}
           />
         </div>
       </div>

       {/* Main Content Area */}
       <main className="main-content">{children}</main>

       {/* Overlay for mobile */}
       {isSidebarOpen && (
         <div className="sidebar-overlay" onClick={toggleSidebar}></div>
       )}
     </div>
   );
};

export default Menu;
