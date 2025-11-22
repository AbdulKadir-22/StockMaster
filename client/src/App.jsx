// FILE: stockmaster-frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Context & Layout
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/layout/AppShell';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/ProductsList';
import ProductCreate from './pages/ProductCreate';
import ReceiptCreate from './pages/ReceiptCreate';
import DeliveryCreate from './pages/DeliveryCreate';
import Ledger from './pages/Ledger';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Protected Routes (Wrapped in AppShell Layout) --- */}
        <Route path="/" element={<AppShell />}>
          {/* Redirect root "/" to "/dashboard" */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Product Management */}
          <Route path="products" element={<ProductsList />} />
          <Route path="products/create" element={<ProductCreate />} />
          
          {/* Transactions (Receipts & Deliveries) */}
          <Route path="receipts/create" element={<ReceiptCreate />} />
          <Route path="deliveries/create" element={<DeliveryCreate />} />
          
          {/* Reporting */}
          <Route path="ledger" element={<Ledger />} />
        </Route>
        
        {/* --- Catch-all Redirect --- */}
        {/* If user visits an unknown route, send them back to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;