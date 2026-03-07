import { useState } from 'react';
import { Search, Plus, Trash2, FileText, Share2, Printer, Pill, ArrowLeft, Stethoscope, PenTool, ChevronDown, ChevronUp } from 'lucide-react';
import StylusPad from '../components/StylusPad';
import usePatients from '../hooks/usePatients';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { showToast } from '../components/Toast';
import { downloadPrescription } from '../utils/pdfUtils';
import { useAuth } from '../context/AuthContext';

const Consultation = () => {
    const { user } = useAuth();
    const { patients } = usePatients();

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [notes, setNotes] = useState('');
    const [showStylusPad, setShowStylusPad] = useState(false);
    const [prescribedMeds, setPrescribedMeds] = useState([]);
    const [activeMeds, setActiveMeds] = useState({ name: '', dosage: '', frequency: '1-0-1 (Twice a day)', duration: '5 days' });

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.mobile.includes(searchTerm)
    );

    const addMedicine = () => {
        if (!activeMeds.name) {
            showToast('Please enter medicine name', 'error');
            return;
        }
        setPrescribedMeds([...prescribedMeds, { ...activeMeds, id: Date.now() }]);
        setActiveMeds({ name: '', dosage: '', frequency: '1-0-1 (Twice a day)', duration: '5 days' });
        showToast(`${activeMeds.name} added to prescription`, 'success');
    };

    const removeMed = (id) => {
        setPrescribedMeds(prescribedMeds.filter(m => m.id !== id));
    };

    const handleGeneratePDF = () => {
        if (!selectedPatient) return;
        if (prescribedMeds.length === 0) {
            showToast('Add at least one medicine to generate prescription', 'error');
            return;
        }
        downloadPrescription({
            clinic: {
                name: 'SmartClinic',
                doctor: user?.name || 'Dr. Sharma',
                address: 'MG Road, Mumbai',
                phone: '+91 98765 43210'
            },
            patient: selectedPatient,
            symptoms,
            diagnosis,
            medicines: prescribedMeds
        });
        showToast('Prescription PDF generated!', 'success');
    };

    const resetConsultation = () => {
        setSelectedPatient(null);
        setSymptoms('');
        setDiagnosis('');
        setNotes('');
        setPrescribedMeds([]);
        setSearchTerm('');
    };

    return (
        <div className="animate-fade-in">
            <PageHeader title="Digital Consultation" subtitle="Create digital prescriptions and referral slips" />

            {!selectedPatient ? (
                <div className="selection-screen glass">
                    <div className="empty-state-icon" style={{ margin: '0 auto 1rem' }}>
                        <Stethoscope size={36} />
                    </div>
                    <h2>Select Patient to Begin</h2>
                    <p className="text-muted text-sm mb-6">Search and select a registered patient to start the consultation</p>

                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search by name or mobile..."
                    />

                    {filteredPatients.length === 0 ? (
                        <p className="text-muted py-4">No patients found. Register patients first.</p>
                    ) : (
                        <div className="patient-list-mini">
                            {filteredPatients.slice(0, 8).map(p => (
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
                <div className="consultation-interface">
                    {/* Left - Examination */}
                    <div className="exam-section glass">
                        <div className="section-header mb-6">
                            <span className="badge">{selectedPatient.name} ({selectedPatient.id})</span>
                            <button className="secondary-btn" onClick={resetConsultation}>
                                <ArrowLeft size={14} /> Change
                            </button>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-background rounded-lg mb-6">
                            <div className="patient-avatar" style={{ width: 40, height: 40, fontSize: '0.9rem' }}>
                                {selectedPatient.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{selectedPatient.name}</p>
                                <p className="text-xs text-muted">{selectedPatient.age}y, {selectedPatient.gender} • {selectedPatient.mobile}</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Chief Symptoms</label>
                            <textarea
                                rows="3"
                                placeholder="Enter symptoms (e.g. Fever for 3 days, dry cough, headache...)"
                                value={symptoms}
                                onChange={e => setSymptoms(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Diagnosis</label>
                            <textarea
                                rows="3"
                                placeholder="Enter clinical diagnosis..."
                                value={diagnosis}
                                onChange={e => setDiagnosis(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Doctor's Notes (Internal)</label>
                            <textarea
                                rows="2"
                                placeholder="Private notes — won't appear on prescription..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Stylus Pad — Collapsible */}
                        <div className="stylus-section">
                            <button
                                className="stylus-toggle-btn"
                                onClick={() => setShowStylusPad(!showStylusPad)}
                                type="button"
                            >
                                <PenTool size={15} className="text-primary" />
                                <span>Quick Sketch / Signature Pad</span>
                                {showStylusPad ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {showStylusPad && (
                                <div className="mt-3" style={{ animation: 'fadeInUp 0.3s ease' }}>
                                    <StylusPad height={260} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right - Prescription */}
                    <div className="prescription-section glass">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Pill size={18} className="text-primary" /> Medication & Dosage
                        </h3>

                        <div className="med-builder">
                            <div className="grid-cols-2">
                                <div className="form-group">
                                    <label>Medicine Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Paracetamol"
                                        value={activeMeds.name}
                                        onChange={e => setActiveMeds({ ...activeMeds, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Dosage</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 500mg"
                                        value={activeMeds.dosage}
                                        onChange={e => setActiveMeds({ ...activeMeds, dosage: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid-cols-2">
                                <div className="form-group">
                                    <label>Frequency</label>
                                    <select value={activeMeds.frequency} onChange={e => setActiveMeds({ ...activeMeds, frequency: e.target.value })}>
                                        <option>1-0-1 (Twice a day)</option>
                                        <option>1-1-1 (Thrice a day)</option>
                                        <option>0-0-1 (At night)</option>
                                        <option>1-0-0 (Morning only)</option>
                                        <option>As needed (SOS)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 5 days"
                                        value={activeMeds.duration}
                                        onChange={e => setActiveMeds({ ...activeMeds, duration: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button className="primary-btn-sm w-full" onClick={addMedicine}>
                                <Plus size={14} /> Add to Prescription
                            </button>
                        </div>

                        <div className="prescribed-list mt-6" style={{ flex: 1, overflowY: 'auto' }}>
                            {prescribedMeds.length === 0 ? (
                                <EmptyState
                                    icon={Pill}
                                    title="No medicines added"
                                    subtitle="Add medicines above to build the prescription"
                                />
                            ) : (
                                prescribedMeds.map((med) => (
                                    <div key={med.id} className="med-pill">
                                        <div>
                                            <strong>{med.name} {med.dosage}</strong>
                                            <p>{med.frequency} • {med.duration}</p>
                                        </div>
                                        <button onClick={() => removeMed(med.id)} className="icon-btn danger" style={{ width: 32, height: 32 }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="action-footer">
                            <button className="primary-btn flex-1" onClick={handleGeneratePDF}>
                                <FileText size={16} /> Generate PDF
                            </button>
                            <button className="icon-btn primary" title="Print" style={{ width: 42, height: 42 }}>
                                <Printer size={18} />
                            </button>
                            <button className="icon-btn" title="Share" style={{ width: 42, height: 42, color: 'var(--secondary)', background: 'var(--secondary-light)' }}>
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Consultation;
