// File Name: Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaThLarge, FaUsers, FaGraduationCap, FaChartBar, FaCode } from 'react-icons/fa';
import './Sidebar.css';

export function Sidebar() {
  const menus = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FaThLarge className="menu-item-icon" />,
    },
    {
      name: "Workforce",
      path: "/workforce",
      icon: <FaUsers className="menu-item-icon" />,
    },
    {
      name: "Skills",
      path: "/skills",
      icon: <FaGraduationCap className="menu-item-icon" />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FaChartBar className="menu-item-icon" />,
    },
    {
      name: "Fetch JSON",
      path: "/fetch",
      icon: <FaCode className="menu-item-icon" />,
    },
  ];

  return (
    <aside className="sidebar">
      <div>
        {/* Custom Logo representing the bar chart icon in mockup */}
        <div className="logo">
          <div className="logo-icon" aria-hidden="true">
            <div className="logo-bar"></div>
            <div className="logo-bar"></div>
            <div className="logo-bar"></div>
          </div>
          <div className="logo-text">
            <h2>Analytics</h2>
            <p>Workforce Platform</p>
          </div>
        </div>

        <nav className="menu">
          {menus.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                isActive ? "menu-item active" : "menu-item"
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
