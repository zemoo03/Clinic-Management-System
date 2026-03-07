import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [loading, setLoading] = useState(false);

    /**
     * Login supports two entity types:
     *  - 'clinic'   → Doctor/Receptionist dashboard
     *  - 'store'    → Medical Store dashboard
     */
    const login = (email, password, entityCode = 'CLINIC001', entityType = 'clinic') => {
        const isStore = entityType === 'store';

        const dummyUser = {
            email,
            name: isStore ? 'MedPlus Pharmacy' : 'Dr. Sharma',
            role: isStore ? 'pharmacist' : 'doctor',
            entityType, // 'clinic' or 'store'
            id: isStore ? 'store_001' : 'doc_001',
            clinicId: isStore ? null : entityCode,
            storeId: isStore ? entityCode : null,
            entityId: entityCode, // universal ID for data scoping
            subscription: 'premium',
            // Linked entities: clinics linked to this store / stores linked to this clinic
            linkedStores: isStore ? [] : ['STORE001', 'STORE002'],
            linkedClinics: isStore ? ['CLINIC001', 'CLINIC002'] : [],
        };
        localStorage.setItem('user', JSON.stringify(dummyUser));
        setUser(dummyUser);
        return Promise.resolve(dummyUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const isClinic = user?.entityType === 'clinic';
    const isStore = user?.entityType === 'store';

    const value = {
        user,
        login,
        logout,
        loading,
        isClinic,
        isStore,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
