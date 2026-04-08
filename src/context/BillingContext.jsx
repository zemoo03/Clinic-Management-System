import { createContext, useContext, useCallback, useState } from 'react';
import { useAuth } from './AuthContext';

const BillingContext = createContext();

export const useBilling = () => useContext(BillingContext);

const STORAGE_KEY = (clinicId) => `scms_${clinicId || 'default'}_shared_invoices`;

export const BillingProvider = ({ children }) => {
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

    const [invoices, setInvoicesState] = useState(readFromStorage);

    const persist = (data) => {
        localStorage.setItem(STORAGE_KEY(clinicId), JSON.stringify(data));
    };

    const setInvoices = (updater) => {
        setInvoicesState(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            persist(next);
            return next;
        });
    };

    const addInvoice = useCallback((data) => {
        const now = new Date();
        const total = (data.items || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const newInvoice = {
            id: `INV-${Date.now()}`,
            patient: data.patient || '',
            patientId: data.patientId || '',
            amount: total,
            date: now.toISOString().split('T')[0],
            time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            status: 'Pending',
            method: '-',
            items: data.items || [],
            diagnosis: data.diagnosis || '',
            createdAt: now.toISOString(),
        };
        setInvoices(prev => [newInvoice, ...prev]);
        return newInvoice;
    }, []); // eslint-disable-line

    const markAsPaid = useCallback((invoiceId, method = 'Cash') => {
        setInvoices(prev =>
            prev.map(inv =>
                inv.id === invoiceId ? { ...inv, status: 'Paid', method } : inv
            )
        );
    }, []); // eslint-disable-line

    const updateInvoice = useCallback((invoiceId, updates) => {
        setInvoices(prev =>
            prev.map(inv => inv.id === invoiceId ? { ...inv, ...updates } : inv)
        );
    }, []); // eslint-disable-line

    const totalCollected = invoices
        .filter(inv => inv.status === 'Paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const totalPending = invoices
        .filter(inv => inv.status === 'Pending')
        .reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <BillingContext.Provider value={{
            invoices,
            addInvoice,
            markAsPaid,
            updateInvoice,
            totalCollected,
            totalPending,
        }}>
            {children}
        </BillingContext.Provider>
    );
};
