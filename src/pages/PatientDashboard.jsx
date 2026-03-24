import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import usePatients from '../hooks/usePatients';
import PageHeader from '../components/PageHeader';
import { Calendar, User, Phone, Droplets, AlertTriangle, FileText, Pill, Activity, ExternalLink } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const PatientDashboard = () => {
    const { user } = useAuth();
    const { getPatient } = usePatients();

    // Fallback if somehow patient data is not loaded properly
    const patientData = getPatient(user?.id) || {
        name: user?.name,
        id: user?.id,
        mobile: 'N/A', age: 'N/A', gender: 'N/A', bloodGroup: 'N/A', allergies: 'None', visits: [],
        registeredOn: user?.loggedInAt?.split('T')[0] || new Date().toISOString().split('T')[0]
    };

    const hasVisits = patientData.visits && patientData.visits.length > 0;

    return (
        <div className="animate-fade-in dashboard-content">
            <PageHeader title="My Health Dashboard" subtitle={`Welcome back, ${patientData.name}`} />

            <div className="grid-cols-3 mb-6">
                <div className="stat-card glass flex flex-col items-center justify-center p-6 text-center">
                    <User size={32} className="text-primary mb-2" />
                    <h3 className="text-sm text-muted font-bold uppercase tracking-wider mb-1">Profile</h3>
                    <p className="text-lg font-bold">{patientData.age} yrs, {patientData.gender}</p>
                </div>
                <div className="stat-card glass flex flex-col items-center justify-center p-6 text-center">
                    <Droplets size={32} className="text-accent mb-2" />
                    <h3 className="text-sm text-muted font-bold uppercase tracking-wider mb-1">Blood Group</h3>
                    <p className="text-lg font-bold">{patientData.bloodGroup || 'Not updated'}</p>
                </div>
                <div className="stat-card glass flex flex-col items-center justify-center p-6 text-center">
                    <AlertTriangle size={32} className="text-warning mb-2" />
                    <h3 className="text-sm text-muted font-bold uppercase tracking-wider mb-1">Allergies</h3>
                    <p className="text-lg font-bold">{patientData.allergies || 'None reported'}</p>
                </div>
            </div>

            <div className="card glass p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText /> Medical History & Consultations</h2>

                {hasVisits ? (
                    <div className="flex flex-col gap-4">
                        {patientData.visits.map((visit, index) => (
                            <div key={index} className="p-5 border border-border/50 rounded-xl bg-background/50">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar size={16} className="text-primary" />
                                            <span className="font-bold text-lg">{visit.date}</span>
                                        </div>
                                        <p className="text-muted font-medium">{visit.doctor}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-sm rounded-full">
                                        {visit.diagnosis || 'Consultation'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {visit.symptoms && (
                                        <div>
                                            <p className="text-xs text-muted font-bold uppercase mb-1">Symptoms</p>
                                            <p className="text-sm">{visit.symptoms}</p>
                                        </div>
                                    )}

                                    {visit.medicines && visit.medicines.length > 0 && (
                                        <div>
                                            <p className="text-xs text-muted font-bold uppercase mb-1 flex items-center gap-1">
                                                <Pill size={12} /> Prescriptions
                                            </p>
                                            <ul className="text-sm space-y-1">
                                                {visit.medicines.map((med, i) => (
                                                    <li key={i}>• <strong>{med.name}</strong> {med.dosage} ({med.frequency}) - {med.duration}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {visit.labReferrals && visit.labReferrals.length > 0 && (
                                        <div>
                                            <p className="text-xs text-muted font-bold uppercase mb-1 flex items-center gap-1">
                                                <Activity size={12} /> Lab Referrals
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {visit.labReferrals.map((lab, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-background border border-border rounded text-xs">
                                                        {lab}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {visit.dietPlan && (
                                        <div className="md:col-span-2 p-3 bg-emerald/5 rounded-lg border border-emerald/10 mt-2">
                                            <p className="text-xs text-emerald font-bold uppercase mb-2 flex items-center gap-1">
                                                <Apple size={14} /> Diet & Homecare Plan: {visit.dietPlan.ageGroup}
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted uppercase">Recommended</p>
                                                    <p className="text-xs">{visit.dietPlan.recommended.map(r => r.item).join(', ')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted uppercase">Avoid</p>
                                                    <p className="text-xs text-accent-dark">{visit.dietPlan.avoid.map(a => a.item).join(', ')}</p>
                                                </div>
                                            </div>
                                            {visit.dietPlan.homecare?.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-emerald/10">
                                                    <p className="text-[10px] font-bold text-muted uppercase">Homecare Tips</p>
                                                    <p className="text-xs">{visit.dietPlan.homecare.map(h => `${h.icon} ${h.tip}`).join(' • ')}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {visit.prescriptionUrl && (
                                        <div className="md:col-span-2 mt-2">
                                            <a href={visit.prescriptionUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
                                                <ExternalLink size={16} /> View Uploaded Prescription Document
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={FileText}
                        title="No past consultations"
                        subtitle="Your visit history will appear here after your first consultation."
                    />
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
