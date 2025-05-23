import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AgencyDashboard from './pages/AgencyDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ComplaintForm from './pages/ComplaintForm';
import ComplaintDetails from './pages/ComplaintDetails';
import SubmitComplaint from './pages/SubmitComplaint';
import Footer from './components/Footer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/submit-complaint"
              element={
                <PrivateRoute>
                  <SubmitComplaint />
                </PrivateRoute>
              }
            />
            <Route
              path="/agency-dashboard"
              element={
                <PrivateRoute allowedRoles={['agency_admin', 'system_admin']}>
                  <AgencyDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/super-admin"
              element={
                <PrivateRoute allowedRoles={['system_admin']}>
                  <SuperAdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/complaints/new"
              element={
                <PrivateRoute>
                  <ComplaintForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/complaints/:id"
              element={
                <PrivateRoute>
                  <ComplaintDetails />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
