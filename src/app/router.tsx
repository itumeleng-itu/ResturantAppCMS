import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
//import Home from '../pages/Home'

export function Router() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}