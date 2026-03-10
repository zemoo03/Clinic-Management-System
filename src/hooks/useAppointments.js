import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const today = new Date().toISOString().split('T')[0];

const DEMO_QUEUE = [
    { token: 'T-001', patientId: 'PAT001', name: 'Rahul Verma', mobile: '9876543210', status: 'Completed', time: '09:15 AM', date: today, type: 'Follow-up', fee: 300 },
    { token: 'T-002', patientId: 'PAT002', name: 'Sita Rani', mobile: '8765432109', status: 'Completed', time: '09:30 AM', date: today, type: 'New', fee: 500 },
    { token: 'T-003', patientId: 'PAT003', name: 'Amit Singh', mobile: '7654321098', status: 'Completed', time: '09:45 AM', date: today, type: 'Follow-up', fee: 300 },
    { token: 'T-004', patientId: 'PAT004', name: 'Priya Desai', mobile: '6543210987', status: 'Consulting', time: '10:00 AM', date: today, type: 'New', fee: 500 },
    { token: 'T-005', patientId: 'PAT005', name: 'Karan Malhotra', mobile: '5432109876', status: 'Waiting', time: '10:15 AM', date: today, type: 'Walk-in', fee: 300 },
    { token: 'T-006', patientId: null, name: 'Neha Gupta', mobile: '9123456780', status: 'Waiting', time: '10:30 AM', date: today, type: 'Walk-in', fee: 300 },
    { token: 'T-007', patientId: null, name: 'Ravi Kumar', mobile: '9012345678', status: 'Waiting', time: '10:45 AM', date: today, type: 'New', fee: 500 },
];

const useQueue = () => {
    const [queue, setQueue] = useLocalStorage('queue', DEMO_QUEUE);

    const todayQueue = queue.filter(q => q.date === today);
    const waitingCount = todayQueue.filter(q => q.status === 'Waiting').length;
    const completedCount = todayQueue.filter(q => q.status === 'Completed').length;
    const consultingItem = todayQueue.find(q => q.status === 'Consulting') || null;
    const waitingList = todayQueue.filter(q => q.status === 'Waiting');

    const nextTokenNum = queue.length + 1;
    const nextToken = `T-${String(nextTokenNum).padStart(3, '0')}`;

    const todayRevenue = todayQueue
        .filter(q => q.status === 'Completed')
        .reduce((sum, q) => sum + (q.fee || 0), 0);

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
            type: patientData.type || 'Walk-in',
            fee: patientData.fee || 300,
        };
        setQueue(prev => [...prev, newItem]);
        return newItem;
    }, [nextToken, setQueue]);

    const callPatient = useCallback((token) => {
        setQueue(prev => prev.map(q => {
            if (q.token === token) return { ...q, status: 'Consulting' };
            // Auto-complete the currently consulting patient
            if (q.status === 'Consulting' && q.date === today) return { ...q, status: 'Completed' };
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

    // Update fee for a specific token
    const updateFee = useCallback((token, fee) => {
        setQueue(prev => prev.map(q =>
            q.token === token ? { ...q, fee: Number(fee) } : q
        ));
    }, [setQueue]);

    return {
        queue: todayQueue,
        allQueue: queue,
        waitingCount,
        completedCount,
        consultingItem,
        waitingList,
        nextToken,
        todayRevenue,
        addToQueue,
        callPatient,
        markCompleted,
        skipPatient,
        updateFee,
        totalToday: todayQueue.length,
    };
};

export default useQueue;
