import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import HRPage from './pages/HRPage';
import ProductionPage from './pages/ProductionPage';
import LogisticsPage from './pages/LogisticsPage';
import QualityPage from './pages/QualityPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return (
    <div className="min-h-screen bg-[#06090f] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/hr" element={<ProtectedRoute><HRPage /></ProtectedRoute>} />
          <Route path="/production" element={<ProtectedRoute><ProductionPage /></ProtectedRoute>} />
          <Route path="/logistics" element={<ProtectedRoute><LogisticsPage /></ProtectedRoute>} />
          <Route path="/quality" element={<ProtectedRoute><QualityPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
