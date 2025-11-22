// FILE: stockmaster-frontend/src/components/layout/AppShell.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AppShell.css';

const AppShell = () => {
  // Mock Auth Check - In real app, redirect to /login if !user
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return null; // Or <Navigate to="/login" />
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppShell;