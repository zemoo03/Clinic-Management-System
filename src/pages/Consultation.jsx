import { useState } from 'react';
import {
    Search, Plus, Trash2, FileText, Share2, Printer, Pill, ArrowLeft, Stethoscope,
    PenTool, ChevronDown, ChevronUp, Activity, Heart, Thermometer, Scale,
    TestTubes, Send, CheckCircle2, Syringe, ScanLine
} from 'lucide-react';
import StylusPad from '../components/StylusPad';
import usePatients from '../hooks/usePatients';
import useQueue from '../hooks/useAppointments';
import useDispensary from '../hooks/useDispensary';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { showToast } from '../components/Toast';
import { downloadPrescription, downloadReferralSlip } from '../utils/pdfUtils';
import { useAuth } from '../context/AuthContext';

const LAB_TESTS = [
    'CBC (Complete Blood Count)', 'Blood Sugar (Fasting)', 'Blood Sugar (PP)',
    'HbA1c', 'Lipid Profile', 'Kidney Function Test', 'Liver Function Test',
    'Thyroid Profile (T3/T4/TSH)', 'Urine Routine', 'Uric Acid',
    'Dengue NS1', 'Malaria (MP)', 'Widal Test', 'CRP',
    'Chest X-Ray', 'ECG', 'Ultrasound Abdomen', 'MRI', 'CT Scan',
    'Pulmonary Function Test', 'Vitamin D', 'Vitamin B12', 'Iron Studies'
];

const Consultation = () => {
    const { user } = useAuth();
    const { patients, addVisit } = usePatients();
    const { consultingItem, markCompleted, waitingList, callPatient } = useQueue();
    const { addOrder } = useDispensary();

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [showStylusPad, setShowStylusPad] = useState(false);
    const [prescribedMeds, setPrescribedMeds] = useState([]);
    const [selectedLabs, setSelectedLabs] = useState([]);
    const [labSearch, setLabSearch] = useState('');
    const [showLabPanel, setShowLabPanel] = useState(false);
    const [prescriptionUrl, setPrescriptionUrl] = useState('');
    const [vitals, setVitals] = useState({ bp: '', temp: '', pulse: '', weight: '', spo2: '' });
    const [activeMeds, setActiveMeds] = useState({ name: '', dosage: '', frequency: '1-0-1 (Twice a day)', duration: '5 days', category: 'medication', dispenseType: 'outdoor' });

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.mobile.includes(searchTerm)
    );

    const filteredLabs = LAB_TESTS.filter(t =>
        t.toLowerCase().includes(labSearch.toLowerCase()) && !selectedLabs.includes(t)
    );

    const addMedicine = () => {
        if (!activeMeds.name) {
            showToast('Please enter medicine name', 'error');
            return;
        }
        setPrescribedMeds([...prescribedMeds, { ...activeMeds, id: Date.now() }]);
        setActiveMeds({ name: '', dosage: '', frequency: '1-0-1 (Twice a day)', duration: '5 days', category: 'medication', dispenseType: 'outdoor' });
        showToast(`${activeMeds.name} added to prescription`, 'success');
    };

    const removeMed = (id) => {
        setPrescribedMeds(prescribedMeds.filter(m => m.id !== id));
    };

    const toggleLab = (labName) => {
        if (selectedLabs.includes(labName)) {
            setSelectedLabs(selectedLabs.filter(l => l !== labName));
        } else {
            setSelectedLabs([...selectedLabs, labName]);
        }
    };

    const handleGeneratePDF = () => {
        if (!selectedPatient) return;
        if (prescribedMeds.length === 0) {
            showToast('Add at least one medicine to generate prescription', 'error');
            return;
        }
        downloadPrescription({
            clinic: {
                name: user?.clinicName || 'SmartClinic',
                doctor: user?.name || 'Dr. Payal Patel',
                address: user?.clinicAddress || 'MG Road, Mumbai',
                phone: user?.clinicPhone || '+91 98765 43210'
            },
            patient: selectedPatient,
            symptoms,
            diagnosis,
            medicines: prescribedMeds,
            vitals,
            labReferrals: selectedLabs,
        });
        showToast('Prescription PDF generated!', 'success');
    };

    const handleGenerateReferral = () => {
        if (!selectedPatient) return;
        if (selectedLabs.length === 0) {
            showToast('Select at least one lab test', 'error');
            return;
        }
        downloadReferralSlip({
            clinic: {
                name: user?.clinicName || 'SmartClinic',
                doctor: user?.name || 'Dr. Payal Patel',
                address: user?.clinicAddress || 'MG Road, Mumbai',
                phone: user?.clinicPhone || '+91 98765 43210'
            },
            patient: selectedPatient,
            diagnosis,
            tests: selectedLabs,
        });
        showToast('Referral slip generated!', 'success');
    };

    const handleSaveAndComplete = () => {
        if (!selectedPatient) return;

        // Save the visit to EMR
        const visitData = {
            date: new Date().toISOString().split('T')[0],
            doctor: user?.name || 'Dr. Payal Patel',
            symptoms,
            diagnosis,
            vitals: { ...vitals },
            medicines: prescribedMeds.map(m => ({ name: m.name, dosage: m.dosage, frequency: m.frequency, duration: m.duration })),
            labReferrals: [...selectedLabs],
            notes,
            prescriptionUrl,
        };
        addVisit(selectedPatient.id, visitData);

        // Mark consulting patient as completed in queue if applicable
        if (consultingItem && consultingItem.patientId === selectedPatient.id) {
            markCompleted(consultingItem.token);
        }

        showToast(`Visit saved to ${selectedPatient.name}'s EMR`, 'success');

        // Auto-create dispensary orders
        if (prescribedMeds.length > 0) {
            const indoorItems = prescribedMeds.filter(m => m.dispenseType === 'indoor');
            const outdoorItems = prescribedMeds.filter(m => m.dispenseType === 'outdoor');

            if (indoorItems.length > 0) {
                addOrder({
                    patientId: selectedPatient.id,
                    patientName: selectedPatient.name,
                    doctor: user?.name || 'Dr. Payal Patel',
                    type: 'indoor',
                    items: indoorItems.map(m => ({
                        category: m.category || 'medication',
                        name: `${m.name} ${m.dosage}`,
                        dosage: m.frequency,
                        duration: m.duration,
                        quantity: 1,
                        dispensed: false,
                    })),
                    notes: notes,
                });
                showToast(`${indoorItems.length} items sent to Indoor Dispensary`, 'info');
            }

            if (outdoorItems.length > 0) {
                addOrder({
                    patientId: selectedPatient.id,
                    patientName: selectedPatient.name,
                    doctor: user?.name || 'Dr. Payal Patel',
                    type: 'outdoor',
                    items: outdoorItems.map(m => ({
                        category: m.category || 'medication',
                        name: `${m.name} ${m.dosage}`,
                        dosage: m.frequency,
                        duration: m.duration,
                        quantity: 1,
                        dispensed: false,
                    })),
                    notes: '',
                });
                showToast(`${outdoorItems.length} items sent to Outdoor Dispensary`, 'info');
            }
        }

        resetConsultation();
    };

    const resetConsultation = () => {
        setSelectedPatient(null);
        setSymptoms('');
        setDiagnosis('');
        setNotes('');
        setPrescribedMeds([]);
        setSelectedLabs([]);
        setLabSearch('');
        setShowLabPanel(false);
        setPrescriptionUrl('');
        setVitals({ bp: '', temp: '', pulse: '', weight: '', spo2: '' });
        setSearchTerm('');
    };

    // Auto-select the currently consulting patient
    const selectFromQueue = () => {
        if (consultingItem?.patientId) {
            const p = patients.find(pt => pt.id === consultingItem.patientId);
            if (p) {
                setSelectedPatient(p);
                return;
            }
        }
        // If no registered patient found, create a temporary one
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

                    {/* Quick selection from queue */}
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

                    {/* Waiting patients */}
                    {waitingList.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-muted mb-2">Waiting in Queue:</h4>
                            <div className="patient-list-mini">
                                {waitingList.slice(0, 4).map(item => {
                                    const registered = patients.find(p => p.id === item.patientId);
                                    return (
                                        <div key={item.token} className="patient-item-selectable" onClick={() => {
                                            if (registered) {
                                                setSelectedPatient(registered);
                                            } else {
                                                setSelectedPatient({ id: item.patientId || `WALK-${item.token}`, name: item.name, age: '-', gender: '-', mobile: item.mobile });
                                            }
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
                            {filteredPatients.length === 0 && searchTerm && (
                                <p className="text-muted py-4">No patients found.</p>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="consultation-interface">
                    {/* Left — Examination */}
                    <div className="exam-section glass">
                        <div className="section-header mb-4">
                            <span className="badge">{selectedPatient.name} ({selectedPatient.id})</span>
                            <button className="secondary-btn" onClick={resetConsultation}>
                                <ArrowLeft size={14} /> Change
                            </button>
                        </div>

                        {/* Patient Info Bar */}
                        <div className="flex items-center gap-3 p-3 bg-background rounded-lg mb-4">
                            <div className="patient-avatar" style={{ width: 40, height: 40, fontSize: '0.9rem' }}>
                                {selectedPatient.name.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p className="font-bold text-sm">{selectedPatient.name}</p>
                                <p className="text-xs text-muted">{selectedPatient.age}y, {selectedPatient.gender} • {selectedPatient.mobile}</p>
                            </div>
                            {selectedPatient.allergies && selectedPatient.allergies !== 'None' && (
                                <span className="tag" style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '0.7rem' }}>
                                    ⚠ {selectedPatient.allergies}
                                </span>
                            )}
                        </div>

                        {/* ═══ PATIENT OVERVIEW — What was told last time ═══ */}
                        {selectedPatient.visits?.length > 0 && (
                            <div className="mb-4" style={{ animation: 'fadeInUp 0.3s ease' }}>
                                {/* Last Visit Instructions Card */}
                                <div className="last-instructions-card">
                                    <h5>📋 LAST VISIT OVERVIEW — {selectedPatient.visits[0].date} (by {selectedPatient.visits[0].doctor})</h5>
                                    <div className="patient-overview-grid">
                                        <div className="overview-card" style={{ borderLeftColor: 'var(--accent)' }}>
                                            <h5>Chief Complaints</h5>
                                            <p>{selectedPatient.visits[0].symptoms || 'N/A'}</p>
                                        </div>
                                        <div className="overview-card" style={{ borderLeftColor: 'var(--emerald)' }}>
                                            <h5>Diagnosis</h5>
                                            <p>{selectedPatient.visits[0].diagnosis || 'N/A'}</p>
                                        </div>
                                    </div>
                                    {selectedPatient.visits[0].medicines?.length > 0 && (
                                        <div className="overview-card mb-2" style={{ borderLeftColor: 'var(--primary)' }}>
                                            <h5>💊 Medications Given</h5>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                                {selectedPatient.visits[0].medicines.map((m, i) => (
                                                    <span key={i} className="tag" style={{ fontSize: '0.75rem' }}>
                                                        {m.name} {m.dosage} ({m.frequency}, {m.duration})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedPatient.visits[0].labReferrals?.length > 0 && (
                                        <div className="overview-card mb-2" style={{ borderLeftColor: 'var(--secondary)' }}>
                                            <h5>🧪 Lab Tests Ordered</h5>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                                {selectedPatient.visits[0].labReferrals.map((lab, i) => (
                                                    <span key={i} className="tag" style={{ background: 'var(--secondary-light)', color: '#0c4a6e', fontSize: '0.75rem' }}>
                                                        {lab}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedPatient.visits[0].notes && (
                                        <div className="overview-card" style={{ borderLeftColor: '#f59e0b', background: 'var(--amber-light)' }}>
                                            <h5>📝 Follow-up Instructions (What was told to patient)</h5>
                                            <p style={{ color: '#92400e', fontStyle: 'italic' }}>{selectedPatient.visits[0].notes}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Previous Visits Timeline (if more than 1 visit) */}
                                {selectedPatient.visits.length > 1 && (
                                    <details className="p-3 bg-background rounded-lg" style={{ cursor: 'pointer' }}>
                                        <summary className="text-xs font-bold text-muted" style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            📚 View all {selectedPatient.visits.length} past visits
                                        </summary>
                                        <div className="visit-timeline mt-3">
                                            {selectedPatient.visits.slice(1).map((visit, idx) => (
                                                <div key={idx} className="timeline-item">
                                                    <p className="text-xs text-muted font-semibold">{visit.date} — {visit.doctor}</p>
                                                    <p className="text-sm font-bold">{visit.diagnosis}</p>
                                                    <p className="text-xs text-muted">
                                                        Rx: {visit.medicines?.map(m => m.name).join(', ') || 'None'}
                                                    </p>
                                                    {visit.notes && (
                                                        <p className="text-xs" style={{ fontStyle: 'italic', color: 'var(--amber)' }}>
                                                            💬 {visit.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                )}
                            </div>
                        )}

                        {/* Vitals Section */}
                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <Heart size={14} className="text-accent" /> Vitals
                        </h4>
                        <div className="vitals-grid mb-4">
                            <div className="vital-input">
                                <label>BP (mmHg)</label>
                                <input type="text" placeholder="120/80" value={vitals.bp}
                                    onChange={e => setVitals({ ...vitals, bp: e.target.value })} />
                            </div>
                            <div className="vital-input">
                                <label>Temp (°F)</label>
                                <input type="text" placeholder="98.6" value={vitals.temp}
                                    onChange={e => setVitals({ ...vitals, temp: e.target.value })} />
                            </div>
                            <div className="vital-input">
                                <label>Pulse (bpm)</label>
                                <input type="text" placeholder="72" value={vitals.pulse}
                                    onChange={e => setVitals({ ...vitals, pulse: e.target.value })} />
                            </div>
                            <div className="vital-input">
                                <label>SpO₂ (%)</label>
                                <input type="text" placeholder="98" value={vitals.spo2}
                                    onChange={e => setVitals({ ...vitals, spo2: e.target.value })} />
                            </div>
                            <div className="vital-input">
                                <label>Weight (kg)</label>
                                <input type="text" placeholder="65" value={vitals.weight}
                                    onChange={e => setVitals({ ...vitals, weight: e.target.value })} />
                            </div>
                        </div>

                        {/* Symptoms */}
                        <div className="form-group">
                            <label>Chief Complaints / Symptoms</label>
                            <textarea rows="3" placeholder="Enter symptoms (e.g. Fever for 3 days, dry cough, headache...)"
                                value={symptoms} onChange={e => setSymptoms(e.target.value)}></textarea>
                        </div>

                        {/* Diagnosis */}
                        <div className="form-group">
                            <label>Diagnosis</label>
                            <textarea rows="2" placeholder="Enter clinical diagnosis..."
                                value={diagnosis} onChange={e => setDiagnosis(e.target.value)}></textarea>
                        </div>

                        {/* Doctor's Notes */}
                        <div className="form-group">
                            <label>Doctor's Notes (Internal)</label>
                            <textarea rows="2" placeholder="Private notes — won't appear on prescription..."
                                value={notes} onChange={e => setNotes(e.target.value)}></textarea>
                        </div>

                        {/* Stylus Pad */}
                        <div className="stylus-section">
                            <button className="stylus-toggle-btn" onClick={() => setShowStylusPad(!showStylusPad)} type="button">
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

                    {/* Right — Prescription & Lab Referrals */}
                    <div className="prescription-section glass">
                        {/* Medications */}
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Pill size={18} className="text-primary" /> Medication & Dosage
                        </h3>

                        <div className="med-builder">
                            <div className="grid-cols-2">
                                <div className="form-group">
                                    <label>Medicine Name</label>
                                    <input type="text" placeholder="e.g. Paracetamol" value={activeMeds.name}
                                        onChange={e => setActiveMeds({ ...activeMeds, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Dosage</label>
                                    <input type="text" placeholder="e.g. 500mg" value={activeMeds.dosage}
                                        onChange={e => setActiveMeds({ ...activeMeds, dosage: e.target.value })} />
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
                                        <option>Stat (Now)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input type="text" placeholder="e.g. 5 days" value={activeMeds.duration}
                                        onChange={e => setActiveMeds({ ...activeMeds, duration: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid-cols-2">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={activeMeds.category} onChange={e => setActiveMeds({ ...activeMeds, category: e.target.value })}>
                                        <option value="medication">💊 Medication / Tablet</option>
                                        <option value="injection">💉 Injection</option>
                                        <option value="iv_fluid">🩸 IV Fluid</option>
                                        <option value="nebulization">🌬️ Nebulization</option>
                                        <option value="dressing">🩹 Dressing / Procedure</option>
                                        <option value="other">📋 Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Dispense To</label>
                                    <select value={activeMeds.dispenseType} onChange={e => setActiveMeds({ ...activeMeds, dispenseType: e.target.value })}>
                                        <option value="outdoor">🏠 Outdoor (Take Home)</option>
                                        <option value="indoor">🏥 Indoor (In-Clinic)</option>
                                    </select>
                                </div>
                            </div>
                            <button className="primary-btn-sm w-full" onClick={addMedicine}>
                                <Plus size={14} /> Add to Prescription
                            </button>
                        </div>

                        <div className="prescribed-list mt-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {prescribedMeds.length === 0 ? (
                                <EmptyState icon={Pill} title="No medicines added" subtitle="Add medicines above to build the prescription" />
                            ) : (
                                prescribedMeds.map((med) => (
                                    <div key={med.id} className="med-pill">
                                        <div>
                                            <strong>{med.name} {med.dosage}</strong>
                                            <p>{med.frequency} • {med.duration}
                                                <span className="tag" style={{
                                                    marginLeft: '0.35rem',
                                                    fontSize: '0.65rem',
                                                    background: med.dispenseType === 'indoor' ? 'var(--secondary-light)' : 'var(--emerald-light)',
                                                    color: med.dispenseType === 'indoor' ? '#0c4a6e' : '#065f46',
                                                }}>
                                                    {med.dispenseType === 'indoor' ? '🏥 Indoor' : '🏠 Outdoor'}
                                                </span>
                                            </p>
                                        </div>
                                        <button onClick={() => removeMed(med.id)} className="icon-btn danger" style={{ width: 32, height: 32 }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Lab / Radiology Referrals */}
                        <div className="lab-referral-section mt-6">
                            <button className="stylus-toggle-btn" onClick={() => setShowLabPanel(!showLabPanel)} type="button">
                                <TestTubes size={15} className="text-secondary" />
                                <span>Lab / Radiology Referrals ({selectedLabs.length})</span>
                                {showLabPanel ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {showLabPanel && (
                                <div className="lab-panel mt-3" style={{ animation: 'fadeInUp 0.3s ease' }}>
                                    <input type="text" placeholder="Search tests..." className="lab-search"
                                        value={labSearch} onChange={e => setLabSearch(e.target.value)} />

                                    {/* Selected Labs */}
                                    {selectedLabs.length > 0 && (
                                        <div className="selected-labs mb-3">
                                            {selectedLabs.map((lab, i) => (
                                                <span key={i} className="lab-tag selected" onClick={() => toggleLab(lab)}>
                                                    {lab} ×
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Available Labs */}
                                    <div className="lab-options">
                                        {filteredLabs.slice(0, 10).map((lab, i) => (
                                            <span key={i} className="lab-tag" onClick={() => toggleLab(lab)}>
                                                + {lab}
                                            </span>
                                        ))}
                                    </div>

                                    {selectedLabs.length > 0 && (
                                        <button className="secondary-btn mt-3 w-full" onClick={handleGenerateReferral}>
                                            <Send size={14} /> Generate Referral Slip
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Upload Scanned Prescription */}
                        <div className="mt-4 p-4 border border-border rounded-lg bg-background">
                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                <ScanLine size={16} className="text-primary" /> Upload Scanned Document
                            </h4>
                            <p className="text-xs text-muted mb-3">Upload a physical prescription or report for the patient.</p>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                className="text-sm w-full"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            setPrescriptionUrl(e.target.result);
                                            showToast('Document uploaded successfully!', 'success');
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            {prescriptionUrl && (
                                <p className="text-xs text-emerald font-bold mt-2">✓ Document securely attached to visit.</p>
                            )}
                        </div>

                        {/* Action Footer */}
                        <div className="action-footer mt-4">
                            <button className="primary-btn flex-1" onClick={handleSaveAndComplete}>
                                <CheckCircle2 size={16} /> Save & Complete Visit
                            </button>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button className="secondary-btn flex-1" onClick={handleGeneratePDF}>
                                <FileText size={14} /> Prescription PDF
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
