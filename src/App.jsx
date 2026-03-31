import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import DietTemplates from './pages/DietTemplates';
import Settings from './pages/Settings';

// Mock Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <DashboardLayout>{children}</DashboardLayout>;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            
            <Route path="/patients" element={
                <ProtectedRoute>
                    <Patients />
                </ProtectedRoute>
            } />

            <Route path="/appointments" element={
                <ProtectedRoute>
                    <Appointments />
                </ProtectedRoute>
            } />

            <Route path="/diet-templates" element={
                <ProtectedRoute>
                    <DietTemplates />
                </ProtectedRoute>
            } />

            <Route path="/settings" element={
                <ProtectedRoute>
                    <Settings />
                </ProtectedRoute>
            } />

            {/* Default fallback */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <UIProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </UIProvider>
        </AuthProvider>
    );
};

export default App;
