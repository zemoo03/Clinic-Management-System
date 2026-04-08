import { createContext, useContext, useCallback, useState } from 'react';
import { useAuth } from './AuthContext';

const PrescriptionsContext = createContext();

export const usePrescriptions = () => useContext(PrescriptionsContext);

const STORAGE_KEY = (clinicId) => `scms_${clinicId || 'default'}_shared_prescriptions`;

export const PrescriptionsProvider = ({ children }) => {
    const { user } = useAuth();
    const clinicId = user?.clinicId || 'default';

    const readFromStorage = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY(clinicId));
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    };

    const [prescriptions, setPrescriptionsState] = useState(readFromStorage);

    const persist = (data) => {
        localStorage.setItem(STORAGE_KEY(clinicId), JSON.stringify(data));
    };

    const setPrescriptions = (updater) => {
        setPrescriptionsState(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            persist(next);
            return next;
        });
    };

    const addPrescription = useCallback((data) => {
        const now = new Date();
        const newRx = {
            id: `RX-${Date.now()}`,
            patient: data.patient || '',
            patientMobile: data.patientMobile || '',
            patientId: data.patientId || '',
            doctor: data.doctor || 'Doctor',
            clinic: data.clinic || 'SmartClinic',
            clinicId: data.clinicId || clinicId,
            diagnosis: data.diagnosis || '',
            labReferrals: data.labReferrals || [],
            medicines: data.medicines || [],
            status: 'Pending',
            date: now.toISOString().split('T')[0],
            time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            createdAt: now.toISOString(),
        };
        setPrescriptions(prev => [newRx, ...prev]);
        return newRx;
    }, [clinicId]); // eslint-disable-line

    const markDispensed = useCallback((rxId) => {
        setPrescriptions(prev =>
            prev.map(rx => rx.id === rxId ? { ...rx, status: 'Dispensed' } : rx)
        );
    }, []); // eslint-disable-line

    const pendingCount = prescriptions.filter(rx => rx.status === 'Pending').length;
    const dispensedCount = prescriptions.filter(rx => rx.status === 'Dispensed').length;

    return (
        <PrescriptionsContext.Provider value={{
            prescriptions,
            addPrescription,
            markDispensed,
            pendingCount,
            dispensedCount,
        }}>
            {children}
        </PrescriptionsContext.Provider>
    );
};
