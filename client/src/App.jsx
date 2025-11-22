// FILE: stockmaster-frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

// Placeholder Components for routing testing
const Login = () => <div className="flex-center" style={{height: '100vh'}}><h1>Login Page</h1></div>;
const Register = () => <div className="flex-center" style={{height: '100vh'}}><h1>Register Page</h1></div>;
const Dashboard = () => <h1>Dashboard Overview</h1>;
const Products = () => <h1>Product Inventory</h1>;
const Receipts = () => <h1>Goods Receipt</h1>;
const Deliveries = () => <h1>Outbound Deliveries</h1>;
const Ledger = () => <h1>Stock Ledger</h1>;

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes wrapped in AppShell */}
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="receipts" element={<Receipts />} />
        <Route path="deliveries" element={<Deliveries />} />
        <Route path="ledger" element={<Ledger />} />
      </Route>
    </Routes>
  );
}

export default App;