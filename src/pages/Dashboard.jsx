import { useState, useEffect } from 'react';
import { 
    FaUser, FaStethoscope, FaClipboardList, FaWallet, 
    FaChartLine, FaRegClock, FaUserPlus, FaReceipt, FaChevronRight,
    FaHospital, FaClock, FaHeartbeat
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import usePatients from '../hooks/usePatients';
import useQueue from '../hooks/useAppointments';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, isDoctor, isAssistant } = useAuth();
    const { totalPatients } = usePatients();
    const { waitingCount, completedCount, consultingItem, queue, todayRevenue, waitingList } = useQueue();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })), 60000);
        return () => clearInterval(timer);
    }, []);

    const recentActivities = [
        { type: 'Prescription', desc: 'Generated for Rahul Verma', time: '10:45 AM', status: 'Completed' },
        { type: 'Registration', desc: 'New Patient: Sita Rani', time: '10:30 AM', status: 'Success' },
        { type: 'Payment', desc: '\u20B9500 collected via UPI (Amit Singh)', time: '09:15 AM', status: 'Success' },
        { type: 'Queue', desc: 'Token T-005 admitted to Room 1', time: '09:00 AM', status: 'Active' },
    ];

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaHospital style={{ color: 'var(--primary)' }} /> 
                        {isDoctor ? 'Clinical Workspace' : 'Front Desk Operations'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        Welcome back, Dr. {user?.name || 'User'} — Session active
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)' }}>{currentTime}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* ─── DOCTOR DASHBOARD ─── */}
            {isDoctor && (
                <>
                    {/* Enterprise Stat Bar */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '6px' }}>
                                <FaUser size={20} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '600', color: 'var(--text-muted)', margin: 0 }}>Total Appointments</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>{queue.length}</h3>
                            </div>
                        </div>
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)', borderRadius: '6px' }}>
                                <FaStethoscope size={20} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '600', color: 'var(--text-muted)', margin: 0 }}>Active Consultation</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>{consultingItem ? 1 : 0}</h3>
                            </div>
                        </div>
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber)', borderRadius: '6px' }}>
                                <FaClipboardList size={20} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '600', color: 'var(--text-muted)', margin: 0 }}>Completed</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>{completedCount}</h3>
                            </div>
                        </div>
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--secondary)', borderRadius: '6px' }}>
                                <FaWallet size={20} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '600', color: 'var(--text-muted)', margin: 0 }}>Today's Revenue</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>&#8377;{todayRevenue?.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                        {/* Queue Table - Practical Enterprise Layout */}
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FaClock size={16} /> Waiting Queue
                                </h3>
                                <Link to="/queue" style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)', textDecoration: 'none' }}>View Full Tracker</Link>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: 'var(--background)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                            <th style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>Token ID</th>
                                            <th style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>Patient Name</th>
                                            <th style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>Visit Type</th>
                                            <th style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>Status</th>
                                            <th style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {consultingItem && (
                                            <tr style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--emerald)' }}>{consultingItem.token}</td>
                                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>{consultingItem.name}</td>
                                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{consultingItem.type}</td>
                                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem' }}>
                                                    <span style={{ display: 'inline-block', padding: '0.15rem 0.5rem', backgroundColor: 'var(--emerald)', color: 'white', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600' }}>ACTIVE ROOM</span>
                                                </td>
                                                <td style={{ padding: '0.75rem 1.25rem' }}>
                                                    <Link to="/consultations" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>Open <FaChevronRight size={10} /></Link>
                                                </td>
                                            </tr>
                                        )}
                                        {waitingList.slice(0, 4).map((item) => (
                                            <tr key={item.token} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>{item.token}</td>
                                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>{item.name}</td>
                                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.type}</td>
                                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.time}</td>
                                                <td style={{ padding: '0.75rem 1.25rem' }}>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Waiting</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {waitingList.length === 0 && !consultingItem && (
                                            <tr>
                                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No patients currently in queue.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Activity Feed */}
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
                                <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FaHeartbeat size={18} /> System Audit Log
                                </h3>
                            </div>
                            <div style={{ padding: '1.25rem', flex: 1 }}>
                                {recentActivities.map((act, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.8rem', marginBottom: i !== recentActivities.length - 1 ? '1.25rem' : '0' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: act.status === 'Completed' ? 'var(--primary)' : 'var(--border)', marginTop: '0.3rem', flexShrink: 0 }} />
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>{act.type}</p>
                                            <p style={{ margin: '0.1rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{act.desc}</p>
                                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-faint)' }}>{act.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>View All Logs</button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Toolbar */}
                    <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                        {[{icon: FaUserPlus, label: 'Add Patient', path: '/patients'}, {icon: FaChartLine, label: 'Reports', path: '/reports'}, {icon: FaClipboardList, label: 'Rx Templates', path: '/diet-templates'}, {icon: FaStethoscope, label: 'Consult', path: '/consultations'}, {icon: FaWallet, label: 'Inventory', path: '/inventory'}].map((item, i) => {
                            const IconComponent = item.icon;
                            return (
                                <Link key={i} to={item.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-main)', textDecoration: 'none', transition: 'all 0.1s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                    <IconComponent size={20} color="var(--primary)" />
                                    <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}

            {/* ─── ASSISTANT / RECEPTIONIST DASHBOARD ─── */}
            {isAssistant && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase' }}>Waiting Room</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: '0.2rem 0', color: 'var(--text-main)' }}>{waitingCount}</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', margin: 0 }}>Patients checked in</p>
                        </div>
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase' }}>In Progress</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: '0.2rem 0', color: 'var(--emerald)' }}>{consultingItem ? 1 : 0}</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', margin: 0 }}>With Doctor</p>
                        </div>
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase' }}>Completed</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: '0.2rem 0', color: 'var(--text-main)' }}>{completedCount}</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', margin: 0 }}>Consultations over</p>
                        </div>
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem', backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary-light)' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-main)', margin: 0, textTransform: 'uppercase' }}>Today's Billing</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: '0.2rem 0', color: 'var(--primary)' }}>&#8377;{todayRevenue?.toLocaleString()}</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Cash & UPI Collected</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {/* Quick Action Utilities */}
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem' }}>
                            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>Reception Utilities</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                                <Link to="/patients" style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '4px', textDecoration: 'none', color: 'inherit', transition: 'border 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                    <FaUserPlus size={18} color="var(--primary)" style={{ marginRight: '1rem' }} />
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Record New Patient</p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Add demographic details to the database</p>
                                    </div>
                                    <FaChevronRight size={12} color="var(--text-faint)" style={{ marginLeft: 'auto' }} />
                                </Link>
                                <Link to="/queue" style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '4px', textDecoration: 'none', color: 'inherit', transition: 'border 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--emerald)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                    <FaRegClock size={18} color="var(--emerald)" style={{ marginRight: '1rem' }} />
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Queue Management</p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assign tokens and manage waitlist</p>
                                    </div>
                                    <FaChevronRight size={12} color="var(--text-faint)" style={{ marginLeft: 'auto' }} />
                                </Link>
                                <Link to="/billing" style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '4px', textDecoration: 'none', color: 'inherit', transition: 'border 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--amber)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                    <FaReceipt size={18} color="var(--amber)" style={{ marginRight: '1rem' }} />
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Generate Receipts</p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Collect consultation & procedure fees</p>
                                    </div>
                                    <FaChevronRight size={12} color="var(--text-faint)" style={{ marginLeft: 'auto' }} />
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity Table */}
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
                                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>Today's Operations Log</h3>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <tbody>
                                    {recentActivities.map((act, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', fontWeight: '500', width: '30%', color: 'var(--text-main)' }}>{act.type}</td>
                                            <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', width: '50%' }}>{act.desc}</td>
                                            <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>{act.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ padding: '0.85rem', textAlign: 'center', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '500', backgroundColor: 'var(--background)', borderTop: '1px solid var(--border)' }}>
                                View Full History
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
