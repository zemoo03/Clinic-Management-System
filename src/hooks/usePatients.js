import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const DEMO_PATIENTS = [
    { id: 'PAT001', name: 'Rahul Verma', age: 34, gender: 'Male', mobile: '9876543210', lastVisit: '2024-02-15', address: 'Andheri West, Mumbai', history: 'Hypertension' },
    { id: 'PAT002', name: 'Sita Rani', age: 28, gender: 'Female', mobile: '8765432109', lastVisit: '2024-02-10', address: 'Bandra, Mumbai', history: 'No known allergies' },
    { id: 'PAT003', name: 'Amit Singh', age: 45, gender: 'Male', mobile: '7654321098', lastVisit: '2024-01-20', address: 'Juhu, Mumbai', history: 'Diabetes Type 2' },
    { id: 'PAT004', name: 'Priya Desai', age: 52, gender: 'Female', mobile: '6543210987', lastVisit: '2024-02-18', address: 'Powai, Mumbai', history: 'Asthma' },
    { id: 'PAT005', name: 'Karan Malhotra', age: 31, gender: 'Male', mobile: '5432109876', lastVisit: '2024-02-19', address: 'Dadar, Mumbai', history: '' },
];

const usePatients = () => {
    const [patients, setPatients] = useLocalStorage('patients', DEMO_PATIENTS);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mobile.includes(searchTerm) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addPatient = useCallback((patientData) => {
        const newPatient = {
            ...patientData,
            id: `PAT${String(patients.length + 1).padStart(3, '0')}`,
            lastVisit: new Date().toISOString().split('T')[0]
        };
        setPatients(prev => [newPatient, ...prev]);
        return newPatient;
    }, [patients.length, setPatients]);

    const updatePatient = useCallback((id, updates) => {
        setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, [setPatients]);

    const deletePatient = useCallback((id) => {
        setPatients(prev => prev.filter(p => p.id !== id));
    }, [setPatients]);

    const getPatient = useCallback((id) => {
        return patients.find(p => p.id === id);
    }, [patients]);

    return {
        patients,
        filteredPatients,
        searchTerm,
        setSearchTerm,
        addPatient,
        updatePatient,
        deletePatient,
        getPatient,
        totalPatients: patients.length
    };
};

export default usePatients;
