import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Reservations from './pages/Reservations';
import Prescriptions from './pages/Prescriptions';
import UserDashboard from './pages/UserDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

function DashboardRouter() {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'admin') {
    return <AdminDashboard />;
  } else if (user.role === 'pharmacy') {
    return <PharmacyDashboard />;
  } else {
    return <UserDashboard />;
  }
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          
          <Route path="/search" element={<ProtectedRoute allowedRoles={['customer']}><Search /></ProtectedRoute>} />
          <Route path="/reservations" element={<ProtectedRoute allowedRoles={['customer']}><Reservations /></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute allowedRoles={['customer']}><Prescriptions /></ProtectedRoute>} />
          
          <Route path="/pharmacy/dashboard" element={<ProtectedRoute allowedRoles={['pharmacy']}><PharmacyDashboard /></ProtectedRoute>} />
          
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
