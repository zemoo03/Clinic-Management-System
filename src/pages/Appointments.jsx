import { useState } from 'react';
import { Clock, CheckCircle2, Play, MoreVertical, Plus, User, SkipForward, Users, Wallet } from 'lucide-react';
import useQueue from '../hooks/useAppointments';
import usePatients from '../hooks/usePatients';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { showToast } from '../components/Toast';

const Queue = () => {
    const { isDoctor, isAssistant } = useAuth();
    const { patients } = usePatients();
    const {
        queue, waitingCount, completedCount, consultingItem,
        nextToken, totalToday, todayRevenue,
        addToQueue, callPatient, markCompleted, skipPatient
    } = useQueue();

    const [isWalkInOpen, setIsWalkInOpen] = useState(false);
    const [isRegisteredOpen, setIsRegisteredOpen] = useState(false);
    const [walkIn, setWalkIn] = useState({ name: '', mobile: '', type: 'Walk-in', fee: 300 });
    const [patientSearch, setPatientSearch] = useState('');

    const getStatusColor = (status) => {
        switch (status) {
            case 'Waiting': return 'status-waiting';
            case 'Consulting': return 'status-active';
            case 'Completed': return 'status-done';
            case 'Skipped': return 'status-skipped';
            default: return '';
        }
    };

    const handleAddWalkIn = (e) => {
        e.preventDefault();
        const item = addToQueue(walkIn);
        showToast(`${walkIn.name} added as ${item.token}`, 'success');
        setWalkIn({ name: '', mobile: '', type: 'Walk-in', fee: 300 });
        setIsWalkInOpen(false);
    };

    const handleAddRegistered = (patient) => {
        const item = addToQueue({
            id: patient.id,
            name: patient.name,
            mobile: patient.mobile,
            type: 'Registered',
            fee: 300,
        });
        showToast(`${patient.name} added as ${item.token}`, 'success');
        setIsRegisteredOpen(false);
        setPatientSearch('');
    };

    const handleCall = (token, name) => {
        callPatient(token);
        showToast(`Calling ${name}...`, 'info');
    };

    const handleComplete = (token, name) => {
        markCompleted(token);
        showToast(`${name} marked as completed`, 'success');
    };

    const handleSkip = (token, name) => {
        skipPatient(token);
        showToast(`${name} skipped`, 'info');
    };

    const filteredRegistered = patients.filter(p =>
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.mobile.includes(patientSearch)
    );

    return (
        <div className="animate-fade-in">
            <PageHeader title="Live Queue" subtitle="Real-time patient tracking & token management">
                {isAssistant && (
                    <>
                        <button className="secondary-btn" onClick={() => setIsRegisteredOpen(true)}>
                            <User size={15} /> From Records
                        </button>
                        <button className="primary-btn-sm" onClick={() => setIsWalkInOpen(true)}>
                            <Plus size={15} /> Walk-in
                        </button>
                    </>
                )}
            </PageHeader>

            <div className="stats-grid">
                <StatCard icon={Clock} label="Waiting" value={waitingCount} />
                <StatCard icon={CheckCircle2} label="Completed" value={completedCount} />
                <StatCard icon={Users} label="Total Today" value={totalToday} />
                {isAssistant ? (
                    <StatCard icon={User} label="Next Token" value={nextToken} variant="luxury" />
                ) : (
                    <StatCard icon={Wallet} label="Revenue Today" value={`₹${todayRevenue.toLocaleString()}`} variant="luxury" />
                )}
            </div>

            {/* Currently Consulting Highlight */}
            {consultingItem && (
                <div className="consulting-highlight glass mb-6">
                    <div className="flex items-center gap-4">
                        <div className="token-id" style={{ background: 'var(--emerald)', color: 'white', border: 'none' }}>
                            {consultingItem.token}
                        </div>
                        <div>
                            <h3 className="font-bold">{consultingItem.name}</h3>
                            <p className="text-sm text-muted">{consultingItem.type} • {consultingItem.time} • ₹{consultingItem.fee}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="status-badge status-active">In Consultation</span>
                        {isAssistant && (
                            <button
                                className="icon-btn success"
                                title="Mark Completed"
                                onClick={() => handleComplete(consultingItem.token, consultingItem.name)}
                            >
                                <CheckCircle2 size={18} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="queue-container glass">
                <div className="queue-header">
                    <h3 className="font-bold">Token List</h3>
                    <div className="flex gap-2">
                        <span className="tag">Morning Session</span>
                    </div>
                </div>

                {queue.length === 0 ? (
                    <EmptyState
                        icon={Clock}
                        title="No appointments yet"
                        subtitle="Add a walk-in patient or registered patient to the queue"
                    />
                ) : (
                    <div className="queue-list">
                        {queue.map((item) => (
                            <div key={item.token} className={`queue-item ${item.status === 'Consulting' ? 'queue-item-active' : ''}`}>
                                <div className="queue-left">
                                    <div className="token-id">{item.token}</div>
                                    <div className="patient-meta">
                                        <h4>{item.name}</h4>
                                        <p>
                                            {item.mobile && `${item.mobile} • `}
                                            {item.time}
                                            {item.type && ` • ${item.type}`}
                                            {` • ₹${item.fee || 0}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="queue-right">
                                    <span className={`status-badge ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>

                                    {isAssistant && item.status === 'Waiting' && (
                                        <>
                                            <button className="icon-btn primary" title="Call Patient" onClick={() => handleCall(item.token, item.name)}>
                                                <Play size={16} fill="currentColor" />
                                            </button>
                                            <button className="icon-btn" title="Skip" onClick={() => handleSkip(item.token, item.name)}>
                                                <SkipForward size={16} />
                                            </button>
                                        </>
                                    )}

                                    {isAssistant && item.status === 'Consulting' && (
                                        <button className="icon-btn success" title="Mark Completed" onClick={() => handleComplete(item.token, item.name)}>
                                            <CheckCircle2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Walk-in Modal */}
            <Modal isOpen={isWalkInOpen} onClose={() => setIsWalkInOpen(false)} title="Add Walk-in Patient" size="sm">
                <form onSubmit={handleAddWalkIn}>
                    <div className="form-group">
                        <label>Patient Name *</label>
                        <input required type="text" placeholder="Full name"
                            value={walkIn.name} onChange={e => setWalkIn({ ...walkIn, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Mobile Number</label>
                        <input type="tel" placeholder="+91 XXXXX XXXXX"
                            value={walkIn.mobile} onChange={e => setWalkIn({ ...walkIn, mobile: e.target.value })} />
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Visit Type</label>
                            <select value={walkIn.type} onChange={e => setWalkIn({ ...walkIn, type: e.target.value })}>
                                <option>Walk-in</option>
                                <option>New</option>
                                <option>Follow-up</option>
                                <option>Emergency</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Consultation Fee (₹)</label>
                            <input type="number" min="0" value={walkIn.fee}
                                onChange={e => setWalkIn({ ...walkIn, fee: Number(e.target.value) })} />
                        </div>
                    </div>
                    <button type="submit" className="primary-btn mt-4">
                        <Plus size={16} /> Add to Queue as {nextToken}
                    </button>
                </form>
            </Modal>

            {/* Add from Registered Patients Modal */}
            <Modal isOpen={isRegisteredOpen} onClose={() => { setIsRegisteredOpen(false); setPatientSearch(''); }} title="Add Patient from Records" size="sm">
                <div className="form-group">
                    <label>Search Patient</label>
                    <input type="text" placeholder="Search by name or mobile..."
                        value={patientSearch} onChange={e => setPatientSearch(e.target.value)} />
                </div>
                <div className="patient-list-mini">
                    {filteredRegistered.slice(0, 8).map(p => (
                        <div key={p.id} className="patient-item-selectable" onClick={() => handleAddRegistered(p)}>
                            <div className="text-left">
                                <strong>{p.name}</strong>
                                <p>{p.id} • {p.mobile} • {p.age}y {p.gender}</p>
                            </div>
                            <Plus size={18} />
                        </div>
                    ))}
                    {filteredRegistered.length === 0 && (
                        <p className="text-center text-muted py-4 text-sm">No patients found</p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Queue;
