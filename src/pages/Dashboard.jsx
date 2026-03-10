import {
    Users, Calendar, Wallet, ClipboardList, Play, Activity, TrendingUp, Clock,
    UserPlus, Stethoscope, Receipt, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import usePatients from '../hooks/usePatients';
import useQueue from '../hooks/useAppointments';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';

const Dashboard = () => {
    const { user, isDoctor, isAssistant } = useAuth();
    const { totalPatients } = usePatients();
    const { waitingCount, completedCount, consultingItem, queue, todayRevenue, waitingList } = useQueue();

    const activities = [
        { title: 'Prescription Generated', meta: 'Rahul Verma • 10 mins ago', active: true },
        { title: 'New Patient Registered', meta: 'Sita Rani • 25 mins ago', active: false },
        { title: 'Payment Received', meta: '₹500 • Amit Singh • 1 hour ago', active: false },
        { title: 'Queue Updated', meta: 'Token T-005 called • 2 hours ago', active: false },
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title={isDoctor ? 'Doctor Dashboard' : 'Reception Dashboard'}
                subtitle={`Welcome back, ${user?.name || 'User'}`}
            >
                <div className="date-display">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </PageHeader>

            {/* ─── DOCTOR DASHBOARD ─── */}
            {isDoctor && (
                <>
                    <div className="stats-grid stagger-children">
                        <StatCard icon={Users} label="Patients Today" value={queue.length} variant="luxury" />
                        <StatCard icon={Stethoscope} label="Consulting" value={consultingItem ? 1 : 0} />
                        <StatCard icon={ClipboardList} label="Completed" value={completedCount} />
                        <StatCard icon={Wallet} label="Revenue Today" value={`₹${todayRevenue.toLocaleString()}`} />
                    </div>

                    <div className="dashboard-grid mt-8">
                        {/* Currently Consulting */}
                        <div className="widget glass">
                            <div className="widget-header">
                                <h3 className="flex items-center gap-2">
                                    <Stethoscope size={16} className="text-primary" /> Current Patient
                                </h3>
                                <Link to="/consultations" className="tag" style={{ cursor: 'pointer' }}>
                                    Open Consultation →
                                </Link>
                            </div>
                            {consultingItem ? (
                                <div className="mini-queue-item" style={{ background: 'var(--emerald-light)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="token-mini" style={{ background: 'var(--emerald)', color: 'white', border: 'none' }}>
                                            {consultingItem.token}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm" style={{ color: 'var(--emerald)' }}>{consultingItem.name}</p>
                                            <p className="text-xs text-muted">{consultingItem.type} • {consultingItem.time}</p>
                                        </div>
                                    </div>
                                    <span className="status-badge status-active">In Room</span>
                                </div>
                            ) : (
                                <p className="text-center text-muted py-6 text-sm">No patient currently in consultation</p>
                            )}

                            <h4 className="font-bold text-sm mt-4 mb-2 text-muted">Up Next ({waitingCount})</h4>
                            {waitingList.slice(0, 3).map((item) => (
                                <div key={item.token} className="mini-queue-item">
                                    <div className="flex items-center gap-3">
                                        <div className="token-mini">{item.token}</div>
                                        <div>
                                            <p className="font-bold text-sm">{item.name}</p>
                                            <p className="text-xs text-muted">{item.type} • {item.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {waitingList.length === 0 && (
                                <p className="text-center text-muted py-2 text-sm">Queue is empty</p>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="widget glass">
                            <div className="widget-header">
                                <h3 className="flex items-center gap-2">
                                    <Activity size={16} className="text-primary" /> Recent Activity
                                </h3>
                            </div>
                            <div className="activity-timeline">
                                {activities.map((item, i) => (
                                    <div key={i} className={`activity-item ${item.active ? 'active' : ''}`}>
                                        <p className="activity-title">{item.title}</p>
                                        <p className="activity-meta">{item.meta}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid-cols-3 mt-6 stagger-children">
                        <div className="glass p-4 rounded-2xl">
                            <p className="text-xs text-muted font-semibold">TOTAL PATIENTS</p>
                            <p className="font-extrabold text-2xl mt-1" style={{ color: 'var(--primary)' }}>{totalPatients}</p>
                            <p className="text-xs text-muted">registered</p>
                        </div>
                        <div className="glass p-4 rounded-2xl">
                            <p className="text-xs text-muted font-semibold">AVERAGE WAIT</p>
                            <p className="font-extrabold text-2xl mt-1">~12 min</p>
                            <p className="text-xs text-muted">per patient</p>
                        </div>
                        <div className="glass p-4 rounded-2xl">
                            <p className="text-xs text-muted font-semibold">THIS WEEK</p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="font-extrabold text-2xl">₹36.8K</p>
                                <span className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--emerald)' }}>
                                    <TrendingUp size={12} /> +8%
                                </span>
                            </div>
                            <p className="text-xs text-muted">revenue collected</p>
                        </div>
                    </div>
                </>
            )}

            {/* ─── ASSISTANT / RECEPTIONIST DASHBOARD ─── */}
            {isAssistant && (
                <>
                    <div className="stats-grid stagger-children">
                        <StatCard icon={Clock} label="Waiting" value={waitingCount} variant="luxury" />
                        <StatCard icon={Stethoscope} label="In Consultation" value={consultingItem ? 1 : 0} />
                        <StatCard icon={ClipboardList} label="Completed" value={completedCount} />
                        <StatCard icon={Users} label="Total Today" value={queue.length} />
                    </div>

                    {/* Quick Actions */}
                    <div className="grid-cols-3 mb-8 stagger-children">
                        <Link to="/patients" className="quick-action-card glass">
                            <div className="quick-action-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                                <UserPlus size={24} />
                            </div>
                            <h4>Register Patient</h4>
                            <p className="text-xs text-muted">Add new patient to records</p>
                        </Link>
                        <Link to="/queue" className="quick-action-card glass">
                            <div className="quick-action-icon" style={{ background: 'var(--emerald-light)', color: 'var(--emerald)' }}>
                                <Calendar size={24} />
                            </div>
                            <h4>Manage Queue</h4>
                            <p className="text-xs text-muted">Add to queue, generate tokens</p>
                        </Link>
                        <Link to="/billing" className="quick-action-card glass">
                            <div className="quick-action-icon" style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}>
                                <Receipt size={24} />
                            </div>
                            <h4>Collect Fee</h4>
                            <p className="text-xs text-muted">Generate consultation receipt</p>
                        </Link>
                    </div>

                    <div className="dashboard-grid">
                        {/* Live Queue */}
                        <div className="widget glass">
                            <div className="widget-header">
                                <h3 className="flex items-center gap-2">
                                    <Clock size={16} className="text-primary" /> Live Queue
                                </h3>
                                <Link to="/queue" className="tag" style={{ cursor: 'pointer' }}>
                                    View All →
                                </Link>
                            </div>

                            {consultingItem && (
                                <div className="mini-queue-item" style={{ background: 'var(--emerald-light)', marginBottom: '0.75rem' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="token-mini" style={{ background: 'var(--emerald)', color: 'white', border: 'none' }}>
                                            {consultingItem.token}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm" style={{ color: 'var(--emerald)' }}>{consultingItem.name}</p>
                                            <p className="text-xs text-muted">Currently consulting</p>
                                        </div>
                                    </div>
                                    <span className="status-badge status-active">Active</span>
                                </div>
                            )}

                            {waitingList.length === 0 ? (
                                <p className="text-center text-muted py-4 text-sm">No patients waiting</p>
                            ) : (
                                waitingList.slice(0, 5).map((item) => (
                                    <div key={item.token} className="mini-queue-item">
                                        <div className="flex items-center gap-3">
                                            <div className="token-mini">{item.token}</div>
                                            <div>
                                                <p className="font-bold text-sm">{item.name}</p>
                                                <p className="text-xs text-muted">Awaiting • {item.time}</p>
                                            </div>
                                        </div>
                                        <Play size={14} className="text-primary" />
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Today's Revenue */}
                        <div className="widget glass">
                            <div className="widget-header">
                                <h3 className="flex items-center gap-2">
                                    <Wallet size={16} className="text-primary" /> Today's Collection
                                </h3>
                            </div>
                            <div className="text-center py-4">
                                <p className="text-4xl font-extrabold" style={{ color: 'var(--emerald)' }}>
                                    ₹{todayRevenue.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted mt-1">from {completedCount} completed consultations</p>
                            </div>
                            <div className="activity-timeline mt-4">
                                {activities.slice(0, 3).map((item, i) => (
                                    <div key={i} className={`activity-item ${item.active ? 'active' : ''}`}>
                                        <p className="activity-title">{item.title}</p>
                                        <p className="activity-meta">{item.meta}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
