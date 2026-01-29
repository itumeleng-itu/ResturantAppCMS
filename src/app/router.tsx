import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import Inventory from '../pages/Inventory';
import OrderManagement from '../pages/Orders';
import ProfilePage from '../pages/ProfilePage';

export function Router() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/orders" element={<OrderManagement />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}