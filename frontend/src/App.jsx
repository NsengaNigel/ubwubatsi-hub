import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PendingVerification from './pages/PendingVerification';
import ClientDashboard from './pages/ClientDashboard';
import ClientProfile from './pages/ClientProfile';
import ClientSettings from './pages/ClientSettings';
import PostProject from './pages/PostProject';
import EditProject from './pages/EditProject';
import BrowseProfessionals from './pages/BrowseProfessionals';
import ProfessionalProfile from './pages/ProfessionalProfile';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import ProfessionalSettings from './pages/ProfessionalSettings';
import Messages from './pages/Messages';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingVerifications from './pages/admin/PendingVerifications';
import Analytics from './pages/admin/Analytics';
import AllUsers from './pages/admin/AllUsers';
import AllProjects from './pages/admin/AllProjects';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#fff8f5',
                color: '#1e1b18',
                border: '1px solid #dcc1b5',
                borderRadius: '0.75rem',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#99420d', secondary: '#fff8f5' } },
              error: { iconTheme: { primary: '#ba1a1a', secondary: '#fff8f5' } },
            }}
          />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route path="/pending-verification" element={<ProtectedRoute><PendingVerification /></ProtectedRoute>} />
            <Route path="/client-dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
            <Route path="/client-profile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
            <Route path="/client-settings" element={<ProtectedRoute><ClientSettings /></ProtectedRoute>} />
            <Route path="/post-project" element={<ProtectedRoute><PostProject /></ProtectedRoute>} />
            <Route path="/edit-project/:id" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
            <Route path="/browse-professionals" element={<ProtectedRoute><BrowseProfessionals /></ProtectedRoute>} />
            <Route path="/professional/:id" element={<ProtectedRoute><ProfessionalProfile /></ProtectedRoute>} />
            <Route path="/professional-dashboard" element={<ProtectedRoute requireVerified><ProfessionalDashboard /></ProtectedRoute>} />
            <Route path="/professional-settings" element={<ProtectedRoute><ProfessionalSettings /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/verifications" element={<AdminRoute><PendingVerifications /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AllUsers /></AdminRoute>} />
            <Route path="/admin/projects" element={<AdminRoute><AllProjects /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
