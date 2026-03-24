import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('scms_user')));
    const [loading, setLoading] = useState(false);

    /**
     * Login with role selection:
     *  - 'doctor'     → Full consultation, EMR, prescription, lab referral access
     *  - 'assistant'  → Patient registration, queue management, billing/receipts
     */
    const login = (name, role = 'doctor', clinicCode = 'CLINIC001') => {
        const roleConfig = {
            doctor: { defaultName: 'Dr. Payal Patel', idPrefix: 'doc_001' },
            assistant: { defaultName: 'Receptionist', idPrefix: 'asst_001' },
            patient: { defaultName: 'Patient Name', idPrefix: 'pat_001' },
        };

        const cfg = roleConfig[role] || roleConfig.doctor;

        const userData = {
            name: name || cfg.defaultName,
            role,
            id: cfg.idPrefix,
            clinicId: clinicCode,
            clinicName: 'SmartClinic',
            clinicAddress: 'MG Road, Mumbai - 400001',
            clinicPhone: '+91 98765 43210',
            specialty: role === 'doctor' ? 'General Medicine' : role === 'patient' ? 'Patient' : 'Reception',
            loggedInAt: new Date().toISOString(),
        };
        localStorage.setItem('scms_user', JSON.stringify(userData));
        setUser(userData);
        return Promise.resolve(userData);
    };

    const logout = () => {
        localStorage.removeItem('scms_user');
        setUser(null);
    };

    const isDoctor = user?.role === 'doctor';
    const isAssistant = user?.role === 'assistant';
    const isPatient = user?.role === 'patient';
    const isDevAdmin = user?.role === 'dev';

    const value = {
        user,
        login,
        logout,
        loading,
        isDoctor,
        isAssistant,
        isPatient,
        isDevAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
