import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Clinic-scoped localStorage hook.
 * Data is scoped by clinicId so different clinics have isolated data.
 */
export const useLocalStorage = (key, initialValue) => {
    const { user } = useAuth();
    const scopeId = user?.clinicId || 'default';
    const scopedKey = `scms_${scopeId}_${key}`;

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
