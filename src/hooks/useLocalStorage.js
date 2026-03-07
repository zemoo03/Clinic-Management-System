import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Multi-tenant localStorage hook.
 * Data is scoped by entityId (clinic OR store) so different entities have isolated data.
 */
export const useLocalStorage = (key, initialValue) => {
    const { user } = useAuth();
    // Use entityId for universal scoping — works for both clinics and stores
    const scopeId = user?.entityId || user?.clinicId || user?.storeId || 'default';
    const scopedKey = `${scopeId}_${key}`;

    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(scopedKey);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(scopedKey, JSON.stringify(storedValue));
        } catch (err) {
            console.error('Failed to save to localStorage:', err);
        }
    }, [scopedKey, storedValue]);

    return [storedValue, setStoredValue];
};

export default useLocalStorage;
