import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';

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
                    <div className="p-8">
                        <h1 className="text-3xl font-black mb-4">Patient Management</h1>
                        <p className="text-faint">Patient records and EMR will be implemented here.</p>
                    </div>
                </ProtectedRoute>
            } />

            <Route path="/appointments" element={
                <ProtectedRoute>
                    <div className="p-8">
                        <h1 className="text-3xl font-black mb-4">Appointment Queue</h1>
                        <p className="text-faint">Queue management and scheduling will be implemented here.</p>
                    </div>
                </ProtectedRoute>
            } />

            <Route path="/settings" element={
                <ProtectedRoute>
                    <div className="p-8">
                        <h1 className="text-3xl font-black mb-4">Account Settings</h1>
                        <p className="text-faint">Profile and clinic settings will be implemented here.</p>
                    </div>
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
