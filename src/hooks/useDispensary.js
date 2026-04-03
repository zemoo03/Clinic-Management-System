import { useCallback, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const DEMO_ORDERS = [
    {
        id: 'DISP001',
        patientId: 'PAT001',
        patientName: 'Rahul Verma',
        date: '2024-02-15',
        doctor: 'Dr. Payal Patel',
        type: 'indoor', // 'indoor' | 'outdoor'
        status: 'pending', // 'pending' | 'dispensed' | 'partial'
        items: [
            { category: 'medication', name: 'Paracetamol 500mg', dosage: '1-0-1', duration: '3 days', quantity: 6, dispensed: false },
            { category: 'injection', name: 'Diclofenac 75mg IM', dosage: 'Stat', duration: 'Once', quantity: 1, dispensed: false },
        ],
        notes: 'Give injection first, then start oral meds',
    },
    {
        id: 'DISP002',
        patientId: 'PAT002',
        patientName: 'Sita Rani',
        date: '2024-02-15',
        doctor: 'Dr. Payal Patel',
        type: 'outdoor',
        status: 'dispensed',
        items: [
            { category: 'medication', name: 'Azithromycin 500mg', dosage: '1-0-0', duration: '3 days', quantity: 3, dispensed: true },
            { category: 'medication', name: 'Cough Syrup', dosage: '10ml 1-1-1', duration: '5 days', quantity: 1, dispensed: true },
        ],
        notes: '',
    },
    {
        id: 'DISP003',
        patientId: 'PAT003',
        patientName: 'Amit Singh',
        date: '2024-02-18',
        doctor: 'Dr. Payal Patel',
        type: 'indoor',
        status: 'pending',
        items: [
            { category: 'iv_fluid', name: 'Normal Saline 500ml', dosage: 'IV Drip', duration: '4 hours', quantity: 1, dispensed: false },
            { category: 'injection', name: 'Ondansetron 4mg IV', dosage: 'Stat', duration: 'Once', quantity: 1, dispensed: false },
            { category: 'medication', name: 'Pantoprazole 40mg', dosage: '1-0-0', duration: '5 days', quantity: 5, dispensed: false },
            { category: 'nebulization', name: 'Duolin + Budecort Nebulization', dosage: '1 session', duration: 'Now', quantity: 1, dispensed: false },
        ],
        notes: 'Start IV first, then nebulization. Monitor BP every 30 mins.',
    },
];

export const DISPENSARY_CATEGORIES = [
    { key: 'medication', label: 'Medications / Tablets', icon: '💊', color: '#4f46e5' },
    { key: 'injection', label: 'Injections', icon: '💉', color: '#f43f5e' },
    { key: 'iv_fluid', label: 'IV Fluids', icon: '🩸', color: '#0ea5e9' },
    { key: 'nebulization', label: 'Nebulization', icon: '🌬️', color: '#10b981' },
    { key: 'dressing', label: 'Dressing / Procedure', icon: '🩹', color: '#f59e0b' },
    { key: 'other', label: 'Other', icon: '📋', color: '#64748b' },
];

const useDispensary = () => {
    const [orders, setOrders] = useLocalStorage('dispensary_orders', DEMO_ORDERS);

    // If user previously cleared localStorage (or it's persisted as empty),
    // restore demo orders so the new tabs don't look empty/broken.
    useEffect(() => {
        if (!orders || orders.length === 0) {
            setOrders(DEMO_ORDERS);
        }
    }, [orders, setOrders]);

    const addOrder = useCallback((orderData) => {
        const newOrder = {
            ...orderData,
            id: `DISP${String(Date.now()).slice(-6)}`,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
        };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    }, [setOrders]);

    const updateOrderStatus = useCallback((orderId, status) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }, [setOrders]);

    const toggleItemDispensed = useCallback((orderId, itemIndex) => {
        setOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                const items = [...o.items];
                items[itemIndex] = { ...items[itemIndex], dispensed: !items[itemIndex].dispensed };
                const allDone = items.every(i => i.dispensed);
                const someDone = items.some(i => i.dispensed);
                return {
                    ...o,
                    items,
                    status: allDone ? 'dispensed' : someDone ? 'partial' : 'pending',
                };
            }
            return o;
        }));
    }, [setOrders]);

    const indoorOrders = orders.filter(o => o.type === 'indoor');
    const outdoorOrders = orders.filter(o => o.type === 'outdoor');
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'partial');
    const completedOrders = orders.filter(o => o.status === 'dispensed');

    const getPatientOrders = useCallback((patientId) => {
        return orders.filter(o => o.patientId === patientId);
    }, [orders]);

    return {
        orders,
        indoorOrders,
        outdoorOrders,
        pendingOrders,
        completedOrders,
        addOrder,
        updateOrderStatus,
        toggleItemDispensed,
        getPatientOrders,
    };
};

export default useDispensary;
