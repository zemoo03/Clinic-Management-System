import { useState } from 'react';
import {
    Plus, Stethoscope, ArrowLeft
} from 'lucide-react';
import usePatients from '../hooks/usePatients';
import useQueue from '../hooks/useAppointments';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import ConsultationForm from '../components/ConsultationForm';

const Consultation = () => {
    const { patients } = usePatients();
    const { consultingItem, waitingList } = useQueue();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.mobile.includes(searchTerm)
    );

    const resetConsultation = () => {
        setSelectedPatient(null);
        setSearchTerm('');
    };

    const selectFromQueue = () => {
        if (consultingItem?.patientId) {
            const p = patients.find(pt => pt.id === consultingItem.patientId);
            if (p) {
                setSelectedPatient(p);
                return;
            }
        }
        if (consultingItem) {
            setSelectedPatient({
                id: consultingItem.patientId || `WALK-${consultingItem.token}`,
                name: consultingItem.name,
                age: '-',
                gender: '-',
                mobile: consultingItem.mobile,
            });
        }
    };

    return (
        <div className="animate-fade-in">
            <PageHeader title="Digital Consultation" subtitle="Examine, prescribe, and generate lab referrals" />

            {!selectedPatient ? (
                <div className="selection-screen glass">
                    <div className="empty-state-icon" style={{ margin: '0 auto 1rem' }}>
                        <Stethoscope size={36} />
                    </div>
                    <h2>Select Patient to Begin</h2>
                    <p className="text-muted text-sm mb-6">Choose the currently consulting patient or search from records</p>

                    {consultingItem && (
                        <div className="consulting-highlight glass mb-6" onClick={selectFromQueue} style={{ cursor: 'pointer' }}>
                            <div className="flex items-center gap-3">
                                <div className="token-mini" style={{ background: 'var(--emerald)', color: 'white', border: 'none' }}>
                                    {consultingItem.token}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold">{consultingItem.name}</p>
                                    <p className="text-xs text-muted">Currently in consultation</p>
                                </div>
                            </div>
                            <span className="status-badge status-active">Select</span>
                        </div>
                    )}

                    {waitingList.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-muted mb-2">Waiting in Queue:</h4>
                            <div className="patient-list-mini">
                                {waitingList.slice(0, 4).map(item => {
                                    const registered = patients.find(p => p.id === item.patientId);
                                    return (
                                        <div key={item.token} className="patient-item-selectable" onClick={() => {
                                            setSelectedPatient(registered || { id: item.patientId || `WALK-${item.token}`, name: item.name, age: '-', gender: '-', mobile: item.mobile });
                                        }}>
                                            <div className="text-left">
                                                <strong>{item.token} — {item.name}</strong>
                                                <p>{item.type} • {item.time}</p>
                                            </div>
                                            <Stethoscope size={16} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Or search by name or mobile..." />

                    {searchTerm && (
                        <div className="patient-list-mini">
                            {filteredPatients.slice(0, 6).map(p => (
                                <div key={p.id} className="patient-item-selectable" onClick={() => setSelectedPatient(p)}>
                                    <div className="text-left">
                                        <strong>{p.name}</strong>
                                        <p>{p.id} • {p.mobile} • {p.age}y {p.gender}</p>
                                    </div>
                                    <Plus size={18} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="consultation-interface-wrapper">
                    <div className="px-4 mb-4 flex justify-between items-center bg-background p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                             <Stethoscope size={18} className="text-primary" />
                             <span className="font-bold text-sm">Patient: {selectedPatient.name}</span>
                        </div>
                        <button className="secondary-btn-sm" onClick={resetConsultation}>
                            <ArrowLeft size={14} /> Change Patient
                        </button>
                    </div>
                    <ConsultationForm patient={selectedPatient} onComplete={resetConsultation} />
                </div>
            )}
        </div>
    );
};

export default Consultation;
