import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import RoleSelect from './pages/RoleSelect';
import Onboarding from './pages/Onboarding';
import VolunteerDashboard from './pages/VolunteerDashboard';
import OpportunityDetail from './pages/OpportunityDetail';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import ImpactReport from './pages/ImpactReport';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function RoleRedirect() {
  const { userData, loading, hasProfile } = useAuth();
  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
  if (!hasProfile) return <Navigate to="/role-select" replace />;
  if (userData?.role === 'coordinator') return <Navigate to="/coordinator" replace />;
  return <Navigate to="/volunteer" replace />;
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <RoleRedirect /> : <Landing />} />
      <Route path="/role-select" element={<ProtectedRoute><RoleSelect /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/volunteer" element={<ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
      <Route path="/opportunity/:id" element={<ProtectedRoute><OpportunityDetail /></ProtectedRoute>} />
      <Route path="/coordinator" element={<ProtectedRoute><CoordinatorDashboard /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><ImpactReport /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
