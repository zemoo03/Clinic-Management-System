import { Users, Calendar, Wallet, ClipboardList, Play, Activity, TrendingUp, Clock } from 'lucide-react';
import usePatients from '../hooks/usePatients';
import useAppointments from '../hooks/useAppointments';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';

const Dashboard = () => {
    const { totalPatients } = usePatients();
    const { waitingCount, completedCount, consultingItem, queue } = useAppointments();

    const waitingQueue = queue.filter(q => q.status === 'Waiting').slice(0, 4);

    const activities = [
        { title: 'Prescription Generated', meta: 'Rahul Verma • 10 mins ago', active: true },
        { title: 'New Patient Registered', meta: 'Sita Rani • 25 mins ago', active: false },
        { title: 'Payment Received', meta: '₹500 • Amit Singh • 1 hour ago', active: false },
        { title: 'Queue Updated', meta: 'Token T-005 called • 2 hours ago', active: false },
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader title="Dashboard Overview" subtitle="Your clinic at a glance">
                <div className="date-display">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </PageHeader>

            <div className="stats-grid stagger-children">
                <StatCard icon={Users} label="Active Patients" value={totalPatients.toLocaleString()} variant="luxury" />
                <StatCard icon={Calendar} label="Today's Queue" value={queue.length} />
                <StatCard icon={Wallet} label="Revenue Today" value="₹12,400" />
                <StatCard icon={ClipboardList} label="Pending Reports" value="6" />
            </div>

            <div className="dashboard-grid mt-8">
                {/* Next in Queue Widget */}
                <div className="widget glass">
                    <div className="widget-header">
                        <h3 className="flex items-center gap-2">
                            <Clock size={16} className="text-primary" /> Next in Queue
                        </h3>
                        <span className="tag">{waitingCount} waiting</span>
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

                    {waitingQueue.length === 0 ? (
                        <p className="text-center text-muted py-4 text-sm">No patients waiting</p>
                    ) : (
                        waitingQueue.map((item) => (
                            <div key={item.token} className="mini-queue-item">
                                <div className="flex items-center gap-3">
                                    <div className="token-mini">{item.token}</div>
                                    <div>
                                        <p className="font-bold text-sm">{item.name}</p>
                                        <p className="text-xs text-muted">Awaiting • {item.time}</p>
                                    </div>
                                </div>
                                <button className="icon-btn primary" style={{ width: 28, height: 28 }}>
                                    <Play size={12} fill="currentColor" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Recent Activities Widget */}
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

            {/* Quick Stats Row */}
            <div className="grid-cols-3 mt-6 stagger-children">
                <div className="glass p-4 rounded-2xl">
                    <p className="text-xs text-muted font-semibold">COMPLETED TODAY</p>
                    <p className="font-extrabold text-2xl mt-1" style={{ color: 'var(--emerald)' }}>{completedCount}</p>
                    <p className="text-xs text-muted">consultations</p>
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
        </div>
    );
};

export default Dashboard;
