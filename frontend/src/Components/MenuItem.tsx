import React from 'react'
import { Link } from 'react-router-dom';

const MenuItem = ({icon, path, isActive, allCaps, onClick}: {icon: string, path: string, isActive: boolean, allCaps: boolean, onClick: () => void}) => {
  return (
      <div
      onClick={onClick}
      >
      <Link
        to={`/${path}`}
        className={`nav-link py-3 align-items-center d-flex px-2 ${
          isActive ? "text-primary" : "text-black"
        }`}
        //</div>onClick={() => setIsSidebarOpen(false)}
      >
        <img src={icon} alt={path} className="img-fluid me-3" />
       {allCaps
         ? path.split("-").map(word => word.toUpperCase()).join(" ")
         : path.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
      </Link>
    </div>
  );
}

export default MenuItem