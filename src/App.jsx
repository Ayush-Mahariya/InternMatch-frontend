import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import Navigation from './components/layout/Navigation';
import Modal from './components/ui/Modal';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ResetPassword from './components/auth/ResetPassword';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import CompanyDashboard from './pages/dashboard/CompanyDashboard';
import JobListings from './pages/jobs/JobListings';
import Applications from './pages/applications/Applications';
import StudentProfile from './pages/profile/StudentProfile';
import CompanyProfile from './pages/profile/CompanyProfile';
import AssessmentsList from './pages/assessments/AssessmentsList';
import CandidateSearch from './pages/candidates/CandidateSearch';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
};

// Main Dashboard Component
const Dashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { user } = useAuth();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return user.role === 'student' 
          ? <StudentDashboard currentView={currentView} setCurrentView={setCurrentView} /> 
          : <CompanyDashboard />;
      case 'jobs':
        return <JobListings />;
      case 'applications':
        return <Applications />;
      case 'profile':
        return user.role === 'student' 
          ? <StudentProfile currentView={currentView} setCurrentView={setCurrentView} /> 
          : <CompanyProfile />;
      case 'assessments':
        return <AssessmentsList />;
      case 'candidates':
        return <CandidateSearch />;
      default:
        return user.role === 'student' 
          ? <StudentDashboard currentView={currentView} setCurrentView={setCurrentView} /> 
          : <CompanyDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 p-8">
        {renderCurrentView()}
      </div>
    </div>
  );
};

// Landing Page with Modals
const LandingWithAuth = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { user } = useAuth();

  // Redirect to dashboard if user is logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingPage 
        onShowLogin={() => setShowLoginModal(true)}
        onShowRegister={() => setShowRegisterModal(true)}
      />
      
      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Sign In to InternMatch"
      >
        <LoginForm onSuccess={handleLoginSuccess} />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              className="text-blue-600 hover:text-blue-700"
              onClick={() => {
                setShowLoginModal(false);
                setShowRegisterModal(true);
              }}
            >
              Sign up here
            </button>
          </p>
        </div>
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Create Your Account"
      >
        <RegisterForm onSuccess={handleRegisterSuccess} />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              className="text-blue-600 hover:text-blue-700"
              onClick={() => {
                setShowRegisterModal(false);
                setShowLoginModal(true);
              }}
            >
              Sign in here
            </button>
          </p>
        </div>
      </Modal>
    </div>
  );
};

// App Component with proper routing
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingWithAuth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
