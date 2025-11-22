// FILE: stockmaster-frontend/src/pages/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (saveMessage) setSaveMessage('');
  };

  const handleSave = (e) => {
    e.preventDefault();

    console.log('Profile update (MVP, front-end only):', formData);
    setSaveMessage('Profile details saved locally (API integration coming soon).');
  };

  const handleLogoutClick = () => {
    logout();
  };

  const effectiveRole = user?.role || 'staff';

  return (
    <div className="profile-container">
      {/* Page header */}
      <div className="profile-header-text">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">
          View your account details and manage your basic information.
        </p>
      </div>

      {/* Summary card */}
      <div className="profile-card summary-card">
        <div className="summary-content">
          <div className="avatar-section">
            {/* Simple initial bubble using the first letter of the name or email */}
            <div className="avatar-placeholder">
              <span className="avatar-initials">
                {(formData.name || formData.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="user-details">
              <h2 className="user-name">
                {formData.name || 'Unnamed User'}
              </h2>
              <p className="user-email">
                {formData.email || 'No email available'}
              </p>
              <p className="user-role">
                Role: {effectiveRole.charAt(0).toUpperCase() + effectiveRole.slice(1)}
              </p>
            </div>
          </div>

          <div className="summary-actions">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={handleLogoutClick}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Editable info card */}
      <div className="profile-card">
        <h3 className="card-title">Personal Information</h3>

        {saveMessage && (
          <div className="profile-info-message">
            {saveMessage}
          </div>
        )}

        <form onSubmit={handleSave}>
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          {/* Email is displayed but not editable in MVP */}
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            disabled={true}
            style={{ backgroundColor: '#f5f7fa', color: '#666' }}
          />

          {/* Optional phone field – purely front-end for now */}
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Optional"
          />

          <div className="form-actions-bottom">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
