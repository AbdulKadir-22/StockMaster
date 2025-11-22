// FILE: stockmaster-frontend/src/components/layout/Sidebar.jsx

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiBox,
  FiDownload,
  FiTruck,
  FiFileText,
  FiLogOut,
  FiUser,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

/**
 * Sidebar
 *
 * Desktop:
 *  - Fixed left sidebar with navigation + logout.
 *
 * Mobile:
 *  - Small top app bar with brand + hamburger button.
 *  - When opened, an "app drawer" slides in from the left
 *    containing the same nav links and logout button.
 */
const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Controls the mobile app drawer open/close state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Main navigation links used in both desktop sidebar and mobile drawer
  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { path: '/products', label: 'Products', icon: <FiBox /> },
    { path: '/receipts/create', label: 'Receipts', icon: <FiDownload /> },
    { path: '/deliveries/create', label: 'Deliveries', icon: <FiTruck /> },
    { path: '/ledger', label: 'Ledger', icon: <FiFileText /> },
  ];

  // Extra account section for MVP – currently just Profile
  const accountNavItems = [
    { path: '/profile', label: 'My Profile', icon: <FiUser /> },
  ];

  const handleLogout = () => {
    // Clear auth state and token via context
    logout();
    // Close drawer on mobile (if open)
    setIsDrawerOpen(false);
    // Redirect to login
    navigate('/login', { replace: true });
  };

  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((open) => !open);

  // Small helper to render a nav link (used in both sections)
  const renderNavItem = (item) => (
    <li key={item.path}>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
        onClick={closeDrawer} // On mobile, selecting a link should close the drawer
      >
        <span className="nav-icon">{item.icon}</span>
        <span className="nav-label">{item.label}</span>
      </NavLink>
    </li>
  );

  return (
    <>
      {/* --- MOBILE APP BAR (visible on small screens) --- */}
      <header className="sidebar-appbar">
        <div className="appbar-left">
          <span className="brand-title">StockMaster</span>
        </div>
        <button
          className="appbar-menu-btn"
          type="button"
          onClick={toggleDrawer}
          aria-label={isDrawerOpen ? 'Close menu' : 'Open menu'}
        >
          {isDrawerOpen ? <FiX /> : <FiMenu />}
        </button>
      </header>

      {/* --- MOBILE DRAWER BACKDROP --- */}
      <div
        className={`sidebar-backdrop ${isDrawerOpen ? 'open' : ''}`}
        onClick={closeDrawer}
      />

      {/* --- SIDEBAR / APP DRAWER --- */}
      <aside
        className={`sidebar ${isDrawerOpen ? 'sidebar--open' : ''}`}
        aria-hidden={!isDrawerOpen}
      >
        {/* Brand area (shown on desktop and inside drawer) */}
        <div className="sidebar-header">
          <h2 className="brand-title">StockMaster</h2>
        </div>

        <nav className="sidebar-nav">
          {/* Main section */}
          <div className="sidebar-section">
            <span className="sidebar-section-label">Main</span>
            <ul>{mainNavItems.map(renderNavItem)}</ul>
          </div>

          {/* Profile / account section */}
          <div className="sidebar-section">
            <span className="sidebar-section-label">Account</span>
            <ul>{accountNavItems.map(renderNavItem)}</ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          {/* Logout button shared by desktop + mobile drawer */}
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
