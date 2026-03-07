import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const today = new Date().toISOString().split('T')[0];

const DEMO_QUEUE = [
    { token: 'T-001', patientId: 'PAT001', name: 'Rahul Verma', mobile: '9876543210', status: 'Completed', time: '09:15 AM', date: today, type: 'Follow-up' },
    { token: 'T-002', patientId: 'PAT002', name: 'Sita Rani', mobile: '8765432109', status: 'Completed', time: '09:30 AM', date: today, type: 'New' },
    { token: 'T-003', patientId: 'PAT003', name: 'Amit Singh', mobile: '7654321098', status: 'Completed', time: '09:45 AM', date: today, type: 'Follow-up' },
    { token: 'T-004', patientId: 'PAT004', name: 'Priya Desai', mobile: '6543210987', status: 'Completed', time: '10:00 AM', date: today, type: 'New' },
    { token: 'T-005', patientId: 'PAT005', name: 'Karan Malhotra', mobile: '5432109876', status: 'Consulting', time: '10:15 AM', date: today, type: 'Walk-in' },
    { token: 'T-006', patientId: null, name: 'Neha Gupta', mobile: '9123456780', status: 'Waiting', time: '10:30 AM', date: today, type: 'Walk-in' },
    { token: 'T-007', patientId: null, name: 'Ravi Kumar', mobile: '9012345678', status: 'Waiting', time: '10:45 AM', date: today, type: 'New' },
    { token: 'T-008', patientId: null, name: 'Deepa Patel', mobile: '8901234567', status: 'Waiting', time: '11:00 AM', date: today, type: 'Follow-up' },
];

const useAppointments = () => {
    const [queue, setQueue] = useLocalStorage('appointments', DEMO_QUEUE);

    const todayQueue = queue.filter(q => q.date === today);
    const waitingCount = todayQueue.filter(q => q.status === 'Waiting').length;
    const completedCount = todayQueue.filter(q => q.status === 'Completed').length;
    const consultingItem = todayQueue.find(q => q.status === 'Consulting');

    const nextToken = `T-${String(queue.length + 1).padStart(3, '0')}`;

    const addToQueue = useCallback((patientData) => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        const newItem = {
            token: nextToken,
            patientId: patientData.id || null,
            name: patientData.name,
            mobile: patientData.mobile || '',
            status: 'Waiting',
            time: timeStr,
            date: today,
            type: patientData.type || 'Walk-in'
        };
        setQueue(prev => [...prev, newItem]);
        return newItem;
    }, [nextToken, setQueue]);

    const callPatient = useCallback((token) => {
        setQueue(prev => prev.map(q => {
            if (q.token === token) return { ...q, status: 'Consulting' };
            if (q.status === 'Consulting') return { ...q, status: 'Completed' };
            return q;
        }));
    }, [setQueue]);

    const markCompleted = useCallback((token) => {
        setQueue(prev => prev.map(q =>
            q.token === token ? { ...q, status: 'Completed' } : q
        ));
    }, [setQueue]);

    const skipPatient = useCallback((token) => {
        setQueue(prev => prev.map(q =>
            q.token === token ? { ...q, status: 'Skipped' } : q
        ));
    }, [setQueue]);

    return {
        queue: todayQueue,
        allQueue: queue,
        waitingCount,
        completedCount,
        consultingItem,
        nextToken,
        addToQueue,
        callPatient,
        markCompleted,
        skipPatient,
        totalToday: todayQueue.length
    };
};

export default useAppointments;
