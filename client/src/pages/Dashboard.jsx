// FILE: stockmaster-frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboard.service';
import { formatDateTime } from '../utils/formatters';

import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getSummary();
        setStats(data || {
          totalProducts: 0,
          lowStockCount: 0,
          pendingReceipts: 0,
          pendingDeliveries: 0,
          recentActivity: []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Optional: Set dummy data for demo if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderActivityType = (type) => {
    let className = 'type-badge';
    switch (type) {
      case 'RECEIPT': className += ' type-receipt'; break;
      case 'DELIVERY': className += ' type-delivery'; break;
      case 'ADJUSTMENT': className += ' type-adjustment'; break;
      case 'TRANSFER': className += ' type-transfer'; break;
      default: break;
    }
    return <span className={className}>{type}</span>;
  };

  if (loading) {
    return <div className="loading-dashboard">Loading Dashboard Overview...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome back, {user?.name || 'User'}</h1>
        <p className="welcome-subtitle">Here is an overview of your inventory status today.</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{stats.totalProducts}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Low Stock Items</span>
          <span className={`stat-value ${stats.lowStockCount > 0 ? 'low-stock' : ''}`}>
            {stats.lowStockCount}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending Receipts</span>
          <span className="stat-value">{stats.pendingReceipts}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending Deliveries</span>
          <span className="stat-value">{stats.pendingDeliveries}</span>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/products/create">
          <Button variant="primary" size="md">+ Add New Product</Button>
        </Link>
        <Link to="/receipts/create">
          <Button variant="secondary" size="md">Create Receipt</Button>
        </Link>
        <Link to="/deliveries/create">
          <Button variant="secondary" size="md">Create Delivery</Button>
        </Link>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
          <Link to="/ledger" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
            View Full Ledger &rarr;
          </Link>
        </div>

        <div className="activity-card">
          {stats.recentActivity.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
              No recent activity found.
            </div>
          ) : (
            <Table headers={['Timestamp', 'Type', 'Product', 'Qty', 'User']}>
              {stats.recentActivity.map((activity, index) => (
                <tr key={index}>
                  <td>{formatDateTime(activity.createdAt)}</td>
                  <td>{renderActivityType(activity.type)}</td>
                  <td>{activity.productName}</td>
                  <td style={{ 
                    fontWeight: '600', 
                    color: activity.quantityChange > 0 ? 'var(--success)' : 'var(--danger)' 
                  }}>
                    {activity.quantityChange > 0 ? '+' : ''}{activity.quantityChange}
                  </td>
                  <td>{activity.userName || 'System'}</td>
                </tr>
              ))}
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;