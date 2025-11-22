// FILE: src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboard.service';
import { formatDateTime } from '../utils/formatters';

import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import './Dashboard.css';

/**
 * Dashboard Overview
 * ------------------
 * Shows high-level KPI numbers + recent stock activity.
 * - Uses safe fallbacks so UI doesn't explode if API shape changes
 * - Does NOT rely on product.quantity (stock is managed via StockItem)
 */
const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    recentActivity: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setError('');
      try {
        const data = await dashboardService.getSummary();

        const safe = {
          totalProducts: data?.totalProducts ?? 0,
          lowStockCount: data?.lowStockCount ?? 0,
          pendingReceipts: data?.pendingReceipts ?? 0,
          pendingDeliveries: data?.pendingDeliveries ?? 0,
          recentActivity: Array.isArray(data?.recentActivity)
            ? data.recentActivity
            : [],
        };

        setStats(safe);
      } catch (err) {
        console.error('Dashboard load error:', err);
        setError('Could not load dashboard at the moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderActivityType = (type) => {
    let className = 'type-badge';
    if (type === 'RECEIPT') className += ' type-receipt';
    if (type === 'DELIVERY') className += ' type-delivery';
    if (type === 'ADJUSTMENT') className += ' type-adjustment';
    if (type === 'TRANSFER') className += ' type-transfer';

    return <span className={className}>{type || 'N/A'}</span>;
  };

  const getProductLabel = (activity) => {
    return (
      activity?.productName ||
      activity?.product?.name ||
      activity?.productSku ||
      'N/A'
    );
  };

  const getUserLabel = (activity) => {
    return (
      activity?.userName ||
      activity?.user?.name ||
      activity?.user?.email ||
      'System'
    );
  };

  const renderQuantityChange = (activity) => {
    const raw = activity?.quantityChange;
    const qty = typeof raw === 'number' ? raw : Number(raw ?? 0);
    const sign = qty > 0 ? '+' : qty < 0 ? '' : ''; // no extra sign for 0

    let colorClass = 'var(--text)';
    if (qty > 0) colorClass = 'var(--success)';
    if (qty < 0) colorClass = 'var(--danger)';

    return (
      <span
        style={{
          fontWeight: 600,
          color: colorClass,
        }}
      >
        {sign}
        {qty}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-dashboard">
        Loading Dashboard Overview...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1 className="welcome-title">
          Welcome back, {user?.name || 'User'}
        </h1>
        <p className="welcome-subtitle">
          Here is an overview of your inventory status today.
        </p>
      </div>

      {error && (
        <div className="error-banner" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{stats.totalProducts}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Low Stock Items</span>
          <span
            className={
              stats.lowStockCount > 0 ? 'stat-value low-stock' : 'stat-value'
            }
          >
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
          <Button variant="primary">+ Add New Product</Button>
        </Link>
        <Link to="/receipts/create">
          <Button variant="secondary">Create Receipt</Button>
        </Link>
        <Link to="/deliveries/create">
          <Button variant="secondary">Create Delivery</Button>
        </Link>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
          <Link
            to="/ledger"
            style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}
          >
            View Full Ledger →
          </Link>
        </div>

        <div className="activity-card">
          {stats.recentActivity.length === 0 ? (
            <div className="empty-state">No recent activity found.</div>
          ) : (
            <Table headers={['Timestamp', 'Type', 'Product', 'Qty', 'User']}>
              {stats.recentActivity.map((activity, index) => (
                <tr key={index}>
                  <td>{formatDateTime(activity?.createdAt)}</td>
                  <td>{renderActivityType(activity?.type)}</td>
                  <td>{getProductLabel(activity)}</td>
                  <td>{renderQuantityChange(activity)}</td>
                  <td>{getUserLabel(activity)}</td>
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
