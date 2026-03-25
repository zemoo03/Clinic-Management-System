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
    const { waitingCount, completedCount, consultingItem, todayRevenue, waitingList } = useQueue();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            {/* COMMON HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.5px' }}>
                        <FaHospital style={{ color: 'var(--primary)' }} /> 
                        {isDoctor ? 'Clinical Workspace' : 'Front Desk Operations'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                        Welcome back, {user?.name || 'User'} — Session active
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{currentTime}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* ─── DOCTOR DASHBOARD ─── */}
            {isDoctor && (
                <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                    {/* DOCTOR STATS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                        <div className="stat-card">
                            <div className="icon-circle" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}><FaUser size={20} /></div>
                            <div className="stat-info"><span className="label">Total Patients</span><span className="value">{totalPatients}</span></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon-circle" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><FaRegClock size={20} /></div>
                            <div className="stat-info"><span className="label">Waiting in Queue</span><span className="value">{waitingCount}</span></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon-circle" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)' }}><FaStethoscope size={20} /></div>
                            <div className="stat-info"><span className="label">Active Consults</span><span className="value">{consultingItem ? 1 : 0}</span></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon-circle" style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--secondary)' }}><FaClipboardList size={20} /></div>
                            <div className="stat-info"><span className="label">Completed Today</span><span className="value">{completedCount}</span></div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '1.5rem' }}>
                        {/* CURRENT/NEXT PATIENT FOCUS AREA */}
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaHeartbeat color="var(--primary)" /> Clinical Focus
                            </h3>
                            
                            {consultingItem ? (
                                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '2.5rem 2rem', textAlign: 'center' }}>
                                    <span style={{ display: 'inline-block', padding: '0.35rem 0.85rem', backgroundColor: 'var(--emerald)', color: 'white', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>ACTIVE CONSULTATION</span>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>{consultingItem.name}</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: '0 0 2.5rem 0' }}>Token: <strong style={{color: 'var(--text-main)'}}>{consultingItem.token}</strong> • {consultingItem.type}</p>
                                    <Link to="/consultations" className="primary-btn" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', borderRadius: '8px' }}>Open Medical Record <FaChevronRight size={14} /></Link>
                                </div>
                            ) : waitingList.length > 0 ? (
                                <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.05)', border: '1px dashed rgba(79, 70, 229, 0.3)', borderRadius: '12px', padding: '2.5rem 2rem', textAlign: 'center' }}>
                                    <span style={{ display: 'inline-block', padding: '0.35rem 0.85rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>UP NEXT IN QUEUE</span>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>{waitingList[0].name}</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: '0 0 2.5rem 0' }}>Token: <strong style={{color: 'var(--text-main)'}}>{waitingList[0].token}</strong> • {waitingList[0].type}</p>
                                    <Link to="/consultations" className="primary-btn" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', borderRadius: '8px' }}>Start Consultation <FaChevronRight size={14} /></Link>
                                </div>
                            ) : (
                                <div style={{ backgroundColor: 'var(--background)', border: '1px dashed var(--border)', borderRadius: '12px', padding: '3.5rem 2rem', textAlign: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-muted)' }}>
                                        <FaClipboardList size={28} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 0.5rem', fontWeight: '700' }}>No Patients Waiting</h3>
                                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>Queue is clear. Take a well-deserved break or review patient reports.</p>
                                </div>
                            )}
                        </div>

                        {/* CLINICAL TOOLS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', flex: 1, boxShadow: 'var(--shadow-sm)' }}>
                                <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>Clinical Tools</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <Link to="/patients" className="secondary-btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '1rem' }}><FaUserPlus color="var(--primary)" size={18} style={{ marginRight: '0.75rem' }} /> Patient Directory</Link>
                                    <Link to="/diet-templates" className="secondary-btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '1rem' }}><FaClipboardList color="var(--emerald)" size={18} style={{ marginRight: '0.75rem' }} /> Rx & Diet Templates</Link>
                                    <Link to="/reports" className="secondary-btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '1rem' }}><FaChartLine color="var(--secondary)" size={18} style={{ marginRight: '0.75rem' }} /> Analytics & Reports</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── ASSISTANT / RECEPTIONIST DASHBOARD ─── */}
            {isAssistant && (
                <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                    {/* RECEPTIONIST STATS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                        <div className="stat-card">
                            <div className="icon-circle" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><FaUser size={20} /></div>
                            <div className="stat-info"><span className="label">Waiting Room</span><span className="value">{waitingCount}</span></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon-circle" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)' }}><FaStethoscope size={20} /></div>
                            <div className="stat-info"><span className="label">With Doctor</span><span className="value">{consultingItem ? 1 : 0}</span></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon-circle" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}><FaClipboardList size={20} /></div>
                            <div className="stat-info"><span className="label">Completed Today</span><span className="value">{completedCount}</span></div>
                        </div>
                        <div className="stat-card luxury" style={{ background: 'var(--primary)' }}>
                            <div className="icon-circle" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}><FaWallet size={20} /></div>
                            <div className="stat-info"><span className="label" style={{ color: 'rgba(255,255,255,0.8)' }}>Today's Billing</span><span className="value" style={{ color: 'white' }}>&#8377;{todayRevenue?.toLocaleString()}</span></div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                        {/* QUEUE OVERVIEW */}
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FaClock size={16} color="var(--primary)" /> Live Queue Status
                                </h3>
                                <Link to="/queue" className="primary-btn-sm" style={{ padding: '0.5rem 1rem' }}>Manage Full Queue</Link>
                            </div>
                            <div style={{ overflowX: 'auto', flex: 1, backgroundColor: 'var(--surface)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: 'var(--surface)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                            <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: '600', letterSpacing: '0.05em' }}>Token</th>
                                            <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: '600', letterSpacing: '0.05em' }}>Patient</th>
                                            <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: '600', letterSpacing: '0.05em' }}>Visit Type</th>
                                            <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: '600', letterSpacing: '0.05em' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {consultingItem && (
                                            <tr style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                                                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.95rem', fontWeight: '700', color: 'var(--emerald)', borderBottom: '1px solid var(--border)' }}>{consultingItem.token}</td>
                                                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', borderBottom: '1px solid var(--border)' }}>{consultingItem.name}</td>
                                                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>{consultingItem.type}</td>
                                                <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                                                    <span style={{ display: 'inline-block', padding: '0.25rem 0.6rem', backgroundColor: 'var(--emerald)', color: 'white', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>WITH DOCTOR</span>
                                                </td>
                                            </tr>
                                        )}
                                        {waitingList.map((item) => (
                                            <tr key={item.token} style={{ transition: 'background-color 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--background)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', borderBottom: '1px solid var(--border)' }}>{item.token}</td>
                                                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '500', borderBottom: '1px solid var(--border)' }}>{item.name}</td>
                                                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{item.type}</td>
                                                <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                                                    <span style={{ display: 'inline-block', padding: '0.25rem 0.6rem', backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>WAITING</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {waitingList.length === 0 && !consultingItem && (
                                            <tr>
                                                <td colSpan="4" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                    <div style={{ marginBottom: '0.5rem' }}><FaUser size={24} style={{ opacity: 0.3 }} /></div>
                                                    <div style={{ fontSize: '0.95rem' }}>No active patients in queue.</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* RECEPTION WORKFLOW */}
                        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>Operational Workflow</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                                <Link to="/patients" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s', backgroundColor: 'var(--background)' }} onMouseEnter={e => {e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'var(--surface)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';}} onMouseLeave={e => {e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--background)'; e.currentTarget.style.boxShadow = 'none';}}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.25rem', flexShrink: 0 }}>
                                        <FaUserPlus size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>1. Registration</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Record new arriving patients</p>
                                    </div>
                                    <FaChevronRight size={14} color="var(--text-faint)" />
                                </Link>
                                
                                <Link to="/queue" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s', backgroundColor: 'var(--background)' }} onMouseEnter={e => {e.currentTarget.style.borderColor = 'var(--emerald)'; e.currentTarget.style.backgroundColor = 'var(--surface)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';}} onMouseLeave={e => {e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--background)'; e.currentTarget.style.boxShadow = 'none';}}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.25rem', flexShrink: 0 }}>
                                        <FaRegClock size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>2. Queue Check-in</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assign tokens & manage waitlist</p>
                                    </div>
                                    <FaChevronRight size={14} color="var(--text-faint)" />
                                </Link>

                                <Link to="/billing" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s', backgroundColor: 'var(--background)' }} onMouseEnter={e => {e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.backgroundColor = 'var(--surface)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';}} onMouseLeave={e => {e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--background)'; e.currentTarget.style.boxShadow = 'none';}}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.25rem', flexShrink: 0 }}>
                                        <FaReceipt size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>3. Billing & Receipts</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Process payments & discharge</p>
                                    </div>
                                    <FaChevronRight size={14} color="var(--text-faint)" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
