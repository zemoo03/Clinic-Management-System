import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const DEMO_PATIENTS = [
    {
        id: 'PAT001', name: 'Rahul Verma', age: 34, gender: 'Male',
        mobile: '9876543210', address: 'Andheri West, Mumbai',
        bloodGroup: 'O+', allergies: 'None',
        registeredOn: '2024-01-10',
        visits: [
            {
                date: '2024-02-15', doctor: 'Dr. Payal Patel',
                symptoms: 'Fever, Headache, Body ache',
                vitals: { bp: '120/80', temp: '101.2°F', pulse: '88 bpm', weight: '72 kg', spo2: '97%' },
                diagnosis: 'Viral Fever',
                medicines: [
                    { name: 'Paracetamol', dosage: '500mg', frequency: '1-0-1', duration: '3 days' },
                    { name: 'Cetirizine', dosage: '10mg', frequency: '0-0-1', duration: '5 days' }
                ],
                labReferrals: ['CBC', 'Dengue NS1'],
                notes: 'Follow up after 3 days if fever persists'
            }
        ]
    },
    {
        id: 'PAT002', name: 'Sita Rani', age: 28, gender: 'Female',
        mobile: '8765432109', address: 'Bandra, Mumbai',
        bloodGroup: 'B+', allergies: 'Penicillin',
        registeredOn: '2024-01-15',
        visits: [
            {
                date: '2024-02-10', doctor: 'Dr. Payal Patel',
                symptoms: 'Sore throat, cough',
                vitals: { bp: '110/70', temp: '99.5°F', pulse: '76 bpm', weight: '58 kg', spo2: '98%' },
                diagnosis: 'Upper Respiratory Tract Infection',
                medicines: [
                    { name: 'Azithromycin', dosage: '500mg', frequency: '1-0-0', duration: '3 days' },
                    { name: 'Cough Syrup (Dextromethorphan)', dosage: '10ml', frequency: '1-1-1', duration: '5 days' }
                ],
                labReferrals: [],
                notes: 'Allergic to Penicillin — use Azithromycin'
            }
        ]
    },
    {
        id: 'PAT003', name: 'Amit Singh', age: 45, gender: 'Male',
        mobile: '7654321098', address: 'Juhu, Mumbai',
        bloodGroup: 'A+', allergies: 'None',
        registeredOn: '2023-11-20',
        visits: [
            {
                date: '2024-02-18', doctor: 'Dr. Payal Patel',
                symptoms: 'Routine checkup, dizziness',
                vitals: { bp: '145/92', temp: '98.6°F', pulse: '82 bpm', weight: '85 kg', spo2: '96%' },
                diagnosis: 'Hypertension (Stage 1)',
                medicines: [
                    { name: 'Amlodipine', dosage: '5mg', frequency: '1-0-0', duration: '30 days' },
                    { name: 'Metformin', dosage: '500mg', frequency: '1-0-1', duration: '30 days' }
                ],
                labReferrals: ['Lipid Profile', 'HbA1c', 'Kidney Function Test'],
                notes: 'Advise dietary modifications, reduce salt intake'
            },
            {
                date: '2024-01-20', doctor: 'Dr. Payal Patel',
                symptoms: 'Blood sugar follow-up',
                vitals: { bp: '140/88', temp: '98.4°F', pulse: '78 bpm', weight: '86 kg', spo2: '97%' },
                diagnosis: 'Diabetes Type 2 — controlled',
                medicines: [
                    { name: 'Metformin', dosage: '500mg', frequency: '1-0-1', duration: '30 days' }
                ],
                labReferrals: ['Fasting Blood Sugar', 'HbA1c'],
                notes: 'HbA1c improved from 7.8 to 7.1'
            }
        ]
    },
    {
        id: 'PAT004', name: 'Priya Desai', age: 52, gender: 'Female',
        mobile: '6543210987', address: 'Powai, Mumbai',
        bloodGroup: 'AB+', allergies: 'Sulfa drugs',
        registeredOn: '2023-12-05',
        visits: [
            {
                date: '2024-02-19', doctor: 'Dr. Payal Patel',
                symptoms: 'Wheezing, breathlessness on exertion',
                vitals: { bp: '125/82', temp: '98.4°F', pulse: '92 bpm', weight: '65 kg', spo2: '93%' },
                diagnosis: 'Bronchial Asthma — Acute Exacerbation',
                medicines: [
                    { name: 'Salbutamol Inhaler', dosage: '100mcg', frequency: 'SOS', duration: 'As needed' },
                    { name: 'Montelukast', dosage: '10mg', frequency: '0-0-1', duration: '30 days' },
                    { name: 'Budesonide Inhaler', dosage: '200mcg', frequency: '1-0-1', duration: '30 days' }
                ],
                labReferrals: ['Chest X-Ray', 'Pulmonary Function Test'],
                notes: 'Avoid cold air, dust exposure. Allergic to Sulfa drugs.'
            }
        ]
    },
    {
        id: 'PAT005', name: 'Karan Malhotra', age: 31, gender: 'Male',
        mobile: '5432109876', address: 'Dadar, Mumbai',
        bloodGroup: 'B-', allergies: 'None',
        registeredOn: '2024-02-01',
        visits: []
    },
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
            registeredOn: new Date().toISOString().split('T')[0],
            visits: [],
            bloodGroup: patientData.bloodGroup || '',
            allergies: patientData.allergies || 'None',
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

    // Add a visit record to a patient's EMR
    const addVisit = useCallback((patientId, visitData) => {
        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                return {
                    ...p,
                    visits: [visitData, ...(p.visits || [])],
                };
            }
            return p;
        }));
    }, [setPatients]);

    // Get last visit for a patient
    const getLastVisit = useCallback((patientId) => {
        const patient = patients.find(p => p.id === patientId);
        return patient?.visits?.[0] || null;
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
        addVisit,
        getLastVisit,
        totalPatients: patients.length,
    };
};

export default usePatients;
