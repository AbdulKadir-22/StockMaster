// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout for protected areas
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
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route path="/" element={<AppShell />}>
          {/* Redirect root → dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="profile" element={<Profile />} />

          {/* Products */}
          <Route path="products" element={<ProductsList />} />
          <Route path="products/create" element={<ProductCreate />} />

          {/* Transactions */}
          <Route path="receipts/create" element={<ReceiptCreate />} />
          <Route path="deliveries/create" element={<DeliveryCreate />} />

          {/* Ledger */}
          <Route path="ledger" element={<Ledger />} />
        </Route>

        {/* FALLBACK ROUTE */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
