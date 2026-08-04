import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './Components/About';
import Service from './Components/Service';
import Navbar from './Components/Navbar';
import ContactForm from './Components/ContactForm';
import Footer from './Components/Footer';
import Register from './Components/Register';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import VerifyEmail from './Components/VerifyEmail';
import CustomerProfile from './Components/CustomerProfile';
import CreateProject from './Components/CreateProject';
import CustomerProjects from './Components/CustomerProjects';
import AdminLogin from './Components/AdminLogin';
import AdminDashboard from './Components/AdminDashboard';
import { ProtectedRoute, AdminRoute } from './Components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const RouteFallback = () => {
  useEffect(() => {
    window.location.href = '/';
  }, []);
  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Subpages */}
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Service />} />
          <Route path="/contact" element={<ContactForm />} />

          {/* Customer Auth & Profile Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <CustomerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-project"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <CustomerProjects />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback to homepage */}
          <Route path="*" element={<RouteFallback />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
