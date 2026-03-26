import { useState, useEffect } from 'react';
import {
    Plus, Trash2, FileText, Share2, Printer, Pill, Stethoscope,
    PenTool, ChevronDown, ChevronUp, Heart, TestTubes, Send, CheckCircle2, ScanLine, Apple, Edit3
} from 'lucide-react';
import StylusPad from './StylusPad';
import usePatients from '../hooks/usePatients';
import useQueue from '../hooks/useAppointments';
import useDispensary from '../hooks/useDispensary';
import { showToast } from './Toast';
import { downloadPrescription, downloadReferralSlip } from '../utils/pdfUtils';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_DIET_TEMPLATES } from '../pages/DietTemplates';
import { Link } from 'react-router-dom';

const LAB_TESTS = [
    'CBC (Complete Blood Count)', 'Blood Sugar (Fasting)', 'Blood Sugar (PP)',
    'HbA1c', 'Lipid Profile', 'Kidney Function Test', 'Liver Function Test',
    'Thyroid Profile (T3/T4/TSH)', 'Urine Routine', 'Uric Acid',
    'Dengue NS1', 'Malaria (MP)', 'Widal Test', 'CRP',
    'Chest X-Ray', 'ECG', 'Ultrasound Abdomen', 'MRI', 'CT Scan',
    'Pulmonary Function Test', 'Vitamin D', 'Vitamin B12', 'Iron Studies'
];

const ConsultationForm = ({ patient, onComplete }) => {
    const { user } = useAuth();
    const { addVisit } = usePatients();
    const { consultingItem, markCompleted } = useQueue();
    const { addOrder } = useDispensary();

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

    // Diet & Homecare state
    const [dietTemplates, setDietTemplates] = useState(() => {
        const saved = localStorage.getItem('diet_templates');
        return saved ? JSON.parse(saved) : DEFAULT_DIET_TEMPLATES;
    });
    const [showDietPanel, setShowDietPanel] = useState(false);
    const [selectedDietTemplate, setSelectedDietTemplate] = useState(null);
    const [customDiet, setCustomDiet] = useState('');

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
        if (!patient) return;
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
            patient: patient,
            symptoms,
            diagnosis,
            medicines: prescribedMeds,
            vitals,
            labReferrals: selectedLabs,
        });
        showToast('Prescription PDF generated!', 'success');
    };

    const handleGenerateReferral = () => {
        if (!patient) return;
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
            patient: patient,
            diagnosis,
            tests: selectedLabs,
        });
        showToast('Referral slip generated!', 'success');
    };

    const handleSaveAndComplete = () => {
        if (!patient) return;

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
            dietPlan: selectedDietTemplate ? { ...selectedDietTemplate } : (customDiet ? { ageGroup: 'Custom', recommended: [{ item: customDiet, details: '' }], avoid: [] } : null),
            prescriptionUrl,
        };
        addVisit(patient.id, visitData);

        // Mark consulting patient as completed in queue if applicable
        if (consultingItem && consultingItem.patientId === patient.id) {
            markCompleted(consultingItem.token);
        }

        showToast(`Visit saved to ${patient.name}'s EMR`, 'success');

        // Auto-create dispensary orders
        if (prescribedMeds.length > 0) {
            const indoorItems = prescribedMeds.filter(m => m.dispenseType === 'indoor');
            const outdoorItems = prescribedMeds.filter(m => m.dispenseType === 'outdoor');

            if (indoorItems.length > 0) {
                addOrder({
                    patientId: patient.id,
                    patientName: patient.name,
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
                    patientId: patient.id,
                    patientName: patient.name,
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

        if (onComplete) onComplete();
    };

    return (
        <div className="consultation-interface animate-fade-in">
            {/* Left — Examination */}
            <div className="exam-section glass">
                {/* Patient Info Bar */}
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg mb-4">
                    <div className="patient-avatar" style={{ width: 40, height: 40, fontSize: '0.9rem' }}>
                        {patient.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                        <p className="font-bold text-sm">{patient.name}</p>
                        <p className="text-xs text-muted">{patient.age}y, {patient.gender} • {patient.mobile}</p>
                    </div>
                    {patient.allergies && patient.allergies !== 'None' && (
                        <span className="tag" style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '0.7rem' }}>
                            ⚠ {patient.allergies}
                        </span>
                    )}
                </div>

                {/* ═══ PATIENT OVERVIEW — What was told last time ═══ */}
                {patient.visits?.length > 0 && (
                    <div className="mb-4" style={{ animation: 'fadeInUp 0.3s ease' }}>
                        {/* Last Visit Instructions Card */}
                        <div className="last-instructions-card">
                            <h5 className="text-xs font-bold mb-2">📋 LAST VISIT OVERVIEW — {patient.visits[0].date}</h5>
                            <div className="patient-overview-grid">
                                <div className="overview-card" style={{ borderLeftColor: 'var(--accent)', padding: '0.5rem' }}>
                                    <h5 className="text-[10px] uppercase text-muted">Complaints</h5>
                                    <p className="text-xs">{patient.visits[0].symptoms || 'N/A'}</p>
                                </div>
                                <div className="overview-card" style={{ borderLeftColor: 'var(--emerald)', padding: '0.5rem' }}>
                                    <h5 className="text-[10px] uppercase text-muted">Diagnosis</h5>
                                    <p className="text-xs">{patient.visits[0].diagnosis || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Vitals Section */}
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Heart size={14} className="text-accent" /> Vitals
                </h4>
                <div className="vitals-grid mb-4">
                    <div className="vital-input">
                        <label className="text-[10px]">BP (mmHg)</label>
                        <input type="text" placeholder="120/80" value={vitals.bp}
                            onChange={e => setVitals({ ...vitals, bp: e.target.value })} />
                    </div>
                    <div className="vital-input">
                        <label className="text-[10px]">Temp (°F)</label>
                        <input type="text" placeholder="98.6" value={vitals.temp}
                            onChange={e => setVitals({ ...vitals, temp: e.target.value })} />
                    </div>
                    <div className="vital-input">
                        <label className="text-[10px]">Pulse (bpm)</label>
                        <input type="text" placeholder="72" value={vitals.pulse}
                            onChange={e => setVitals({ ...vitals, pulse: e.target.value })} />
                    </div>
                    <div className="vital-input">
                        <label className="text-[10px]">SpO₂ (%)</label>
                        <input type="text" placeholder="98" value={vitals.spo2}
                            onChange={e => setVitals({ ...vitals, spo2: e.target.value })} />
                    </div>
                    <div className="vital-input">
                        <label className="text-[10px]">Weight (kg)</label>
                        <input type="text" placeholder="65" value={vitals.weight}
                            onChange={e => setVitals({ ...vitals, weight: e.target.value })} />
                    </div>
                </div>

                {/* Symptoms */}
                <div className="form-group">
                    <label className="text-xs">Chief Complaints / Symptoms</label>
                    <textarea className="text-xs" rows="2" placeholder="Enter symptoms..."
                        value={symptoms} onChange={e => setSymptoms(e.target.value)}></textarea>
                </div>

                {/* Diagnosis */}
                <div className="form-group">
                    <label className="text-xs">Diagnosis</label>
                    <textarea className="text-xs" rows="1" placeholder="Enter clinical diagnosis..."
                        value={diagnosis} onChange={e => setDiagnosis(e.target.value)}></textarea>
                </div>

                {/* Doctor's Notes */}
                <div className="form-group">
                    <label className="text-xs">Doctor's Notes (Internal)</label>
                    <textarea className="text-xs" rows="1" placeholder="Private notes..."
                        value={notes} onChange={e => setNotes(e.target.value)}></textarea>
                </div>

                {/* Stylus Pad */}
                <div className="stylus-section">
                    <button className="stylus-toggle-btn" onClick={() => setShowStylusPad(!showStylusPad)} type="button">
                        <PenTool size={13} className="text-primary" />
                        <span className="text-xs">Sketch / Signature</span>
                        {showStylusPad ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {showStylusPad && (
                        <div className="mt-2">
                            <StylusPad height={180} />
                        </div>
                    )}
                </div>
            </div>

            {/* Right — Prescription & Lab Referrals */}
            <div className="prescription-section glass">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-sm">
                    <Pill size={16} className="text-primary" /> Medication & Dosage
                </h3>

                <div className="med-builder p-3 bg-background/50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="form-group mb-0">
                            <label className="text-[10px]">Name</label>
                            <input type="text" className="text-xs p-1" placeholder="Paracetamol" value={activeMeds.name}
                                onChange={e => setActiveMeds({ ...activeMeds, name: e.target.value })} />
                        </div>
                        <div className="form-group mb-0">
                            <label className="text-[10px]">Dosage</label>
                            <input type="text" className="text-xs p-1" placeholder="500mg" value={activeMeds.dosage}
                                onChange={e => setActiveMeds({ ...activeMeds, dosage: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="form-group mb-0">
                            <label className="text-[10px]">Frequency</label>
                            <select className="text-xs p-1" value={activeMeds.frequency} onChange={e => setActiveMeds({ ...activeMeds, frequency: e.target.value })}>
                                <option>1-0-1 (Twice a day)</option>
                                <option>1-1-1 (Thrice a day)</option>
                                <option>0-0-1 (At night)</option>
                                <option>1-0-0 (Morning only)</option>
                                <option>As needed (SOS)</option>
                                <option>Stat (Now)</option>
                            </select>
                        </div>
                        <div className="form-group mb-0">
                            <label className="text-[10px]">Duration</label>
                            <input type="text" className="text-xs p-1" placeholder="5 days" value={activeMeds.duration}
                                onChange={e => setActiveMeds({ ...activeMeds, duration: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="form-group mb-0">
                            <label className="text-[10px]">Category</label>
                            <select className="text-xs p-1" value={activeMeds.category} onChange={e => setActiveMeds({ ...activeMeds, category: e.target.value })}>
                                <option value="medication">Medication</option>
                                <option value="injection">Injection</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group mb-0">
                            <label className="text-[10px]">Dispense</label>
                            <select className="text-xs p-1" value={activeMeds.dispenseType} onChange={e => setActiveMeds({ ...activeMeds, dispenseType: e.target.value })}>
                                <option value="outdoor">Outdoor</option>
                                <option value="indoor">Indoor</option>
                            </select>
                        </div>
                    </div>
                    <button className="primary-btn-sm w-full" onClick={addMedicine}>
                        <Plus size={12} /> Add
                    </button>
                </div>

                <div className="prescribed-list mt-3 max-h-32 overflow-y-auto">
                    {prescribedMeds.map((med) => (
                        <div key={med.id} className="med-pill flex justify-between items-center p-2 mb-1 bg-background rounded border border-border">
                            <div className="text-[11px]">
                                <strong>{med.name} {med.dosage}</strong>
                                <span className="text-muted block">{med.frequency} • {med.duration}</span>
                            </div>
                            <button onClick={() => removeMed(med.id)} className="text-accent hover:text-red-500">
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Lab Referrals Mini */}
                <div className="mt-3">
                    <button className="stylus-toggle-btn p-2" onClick={() => setShowLabPanel(!showLabPanel)} type="button">
                        <TestTubes size={13} className="text-secondary" />
                        <span className="text-[11px]">Lab Referrals ({selectedLabs.length})</span>
                        {showLabPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {showLabPanel && (
                        <div className="p-3 bg-background border border-border rounded-lg mt-1">
                            <input type="text" placeholder="Search..." className="text-xs w-full p-1 mb-2 border rounded"
                                value={labSearch} onChange={e => setLabSearch(e.target.value)} />
                            <div className="flex flex-wrap gap-1">
                                {filteredLabs.slice(0, 8).map((lab, i) => (
                                    <span key={i} className="lab-tag text-[9px] p-1 bg-muted rounded cursor-pointer" onClick={() => toggleLab(lab)}>
                                        + {lab}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Diet Plan Mini */}
                <div className="mt-2">
                    <button className="stylus-toggle-btn p-2" onClick={() => setShowDietPanel(!showDietPanel)} type="button">
                        <Apple size={13} className="text-emerald" />
                        <span className="text-[11px]">Diet & Homecare</span>
                        {showDietPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {showDietPanel && (
                        <div className="p-2 bg-background border border-border rounded-lg mt-1">
                            <div className="flex flex-wrap gap-1 mb-2">
                                {dietTemplates.slice(0, 4).map(t => (
                                    <span 
                                        key={t.id} 
                                        className={`tag text-[9px] cursor-pointer ${selectedDietTemplate?.id === t.id ? 'active' : ''}`}
                                        onClick={() => setSelectedDietTemplate(t)}
                                        style={{ background: selectedDietTemplate?.id === t.id ? 'var(--emerald)' : 'var(--background)' }}
                                    >
                                        {t.ageGroup}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                    <button className="primary-btn-sm w-full py-2 bg-primary text-white" onClick={handleSaveAndComplete}>
                        <CheckCircle2 size={14} /> Save Visit
                    </button>
                    <div className="flex gap-2">
                        <button className="secondary-btn-sm flex-1 text-[11px]" onClick={handleGeneratePDF}>
                             PDF Rx
                        </button>
                        <button className="secondary-btn-sm flex-1 text-[11px]" onClick={() => window.print()}>
                             Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationForm;
