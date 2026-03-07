import { useState } from 'react';
import { Clock, CheckCircle2, Play, MoreVertical, Plus, User, SkipForward, Users } from 'lucide-react';
import useAppointments from '../hooks/useAppointments';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { showToast } from '../components/Toast';

const Appointments = () => {
    const {
        queue,
        waitingCount,
        completedCount,
        consultingItem,
        nextToken,
        totalToday,
        addToQueue,
        callPatient,
        markCompleted,
        skipPatient
    } = useAppointments();

    const [isWalkInOpen, setIsWalkInOpen] = useState(false);
    const [walkIn, setWalkIn] = useState({ name: '', mobile: '', type: 'Walk-in' });

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
        setWalkIn({ name: '', mobile: '', type: 'Walk-in' });
        setIsWalkInOpen(false);
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

    return (
        <div className="animate-fade-in">
            <PageHeader title="Live Queue" subtitle="Real-time patient tracking & token management">
                <button className="secondary-btn">
                    <Clock size={15} /> Today's Settings
                </button>
                <button className="primary-btn-sm" onClick={() => setIsWalkInOpen(true)}>
                    <Plus size={15} /> Walk-in
                </button>
            </PageHeader>

            <div className="stats-grid">
                <StatCard icon={Clock} label="Waiting" value={waitingCount} />
                <StatCard icon={CheckCircle2} label="Completed" value={completedCount} />
                <StatCard icon={Users} label="Total Today" value={totalToday} />
                <StatCard icon={User} label="Next Token" value={nextToken} variant="luxury" />
            </div>

            <div className="queue-container glass">
                <div className="queue-header">
                    <h3 className="font-bold">Token List</h3>
                    <div className="flex gap-2">
                        <span className="tag">Morning Slot (09:00 – 13:00)</span>
                    </div>
                </div>

                {queue.length === 0 ? (
                    <EmptyState
                        icon={Clock}
                        title="No appointments yet"
                        subtitle="Add a walk-in patient or wait for scheduled appointments"
                    />
                ) : (
                    <div className="queue-list">
                        {queue.map((item) => (
                            <div key={item.token} className="queue-item">
                                <div className="queue-left">
                                    <div className="token-id">{item.token}</div>
                                    <div className="patient-meta">
                                        <h4>{item.name}</h4>
                                        <p>
                                            {item.mobile && `${item.mobile} • `}
                                            {item.time}
                                            {item.type && ` • ${item.type}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="queue-right">
                                    <span className={`status-badge ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>

                                    {item.status === 'Waiting' && (
                                        <>
                                            <button
                                                className="icon-btn primary"
                                                title="Call Patient"
                                                onClick={() => handleCall(item.token, item.name)}
                                            >
                                                <Play size={16} fill="currentColor" />
                                            </button>
                                            <button
                                                className="icon-btn"
                                                title="Skip"
                                                onClick={() => handleSkip(item.token, item.name)}
                                            >
                                                <SkipForward size={16} />
                                            </button>
                                        </>
                                    )}

                                    {item.status === 'Consulting' && (
                                        <button
                                            className="icon-btn success"
                                            title="Mark Completed"
                                            onClick={() => handleComplete(item.token, item.name)}
                                        >
                                            <CheckCircle2 size={16} />
                                        </button>
                                    )}

                                    <button className="icon-btn" title="More options">
                                        <MoreVertical size={16} />
                                    </button>
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
                        <label>Patient Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Full name"
                            value={walkIn.name}
                            onChange={e => setWalkIn({ ...walkIn, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mobile Number</label>
                        <input
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={walkIn.mobile}
                            onChange={e => setWalkIn({ ...walkIn, mobile: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Visit Type</label>
                        <select value={walkIn.type} onChange={e => setWalkIn({ ...walkIn, type: e.target.value })}>
                            <option>Walk-in</option>
                            <option>New</option>
                            <option>Follow-up</option>
                            <option>Emergency</option>
                        </select>
                    </div>
                    <button type="submit" className="primary-btn mt-4">
                        <Plus size={16} /> Add to Queue as {nextToken}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Appointments;
