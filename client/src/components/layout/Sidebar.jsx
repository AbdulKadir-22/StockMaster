// FILE: stockmaster-frontend/src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiBox, 
  FiDownload, 
  FiTruck, 
  FiFileText, 
  FiLogOut 
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth tokens logic here
    console.log('Logging out...');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { path: '/products', label: 'Products', icon: <FiBox /> },
    { path: '/receipts', label: 'Receipts', icon: <FiDownload /> },
    { path: '/deliveries', label: 'Deliveries', icon: <FiTruck /> },
    { path: '/ledger', label: 'Ledger', icon: <FiFileText /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="brand-title">StockMaster</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FiLogOut />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;