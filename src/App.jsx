import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
    LayoutDashboard, Users, Calendar, Wallet, BarChart3,
    Settings, LogOut, Stethoscope, UserCog, Shield, Pill, Package, FileText,
    Syringe, Apple, ScanLine, Heart, User, Link2, Smartphone, Download,
    Eye, EyeOff, Moon, Sun
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ToastContainer } from './components/Toast';
import { applySettings, loadSettings } from './pages/Settings';

// Pages — Clinic
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Queue from './pages/Appointments';
import Consultation from './pages/Consultation';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';
import IndoorDispensary from './pages/IndoorDispensary';
import OutdoorDispensary from './pages/OutdoorDispensary';
import DietTemplates from './pages/DietTemplates';
import DocumentScanner from './pages/DocumentScanner';
import Prescriptions from './pages/Prescriptions';
import Inventory from './pages/Inventory';
import LinkedEntities from './pages/LinkedEntities';
import PharmacyDashboard from './pages/PharmacyDashboard';

import PatientDashboard from './pages/PatientDashboard';

/* ═══════════════════════════════
   DOCTOR SIDEBAR
   ═══════════════════════════════ */
const DoctorSidebar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const clinicalItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/queue', icon: Calendar, label: 'Patient Queue' },
        { path: '/patients', icon: Users, label: 'Patient Records' },
        { path: '/consultations', icon: Stethoscope, label: 'Consultation' },
    ];

    const dispensaryItems = [
        { path: '/indoor-dispensary', icon: Syringe, label: 'Indoor Dispensary' },
        { path: '/outdoor-dispensary', icon: Pill, label: 'Outdoor Dispensary' },
        { path: '/diet-templates', icon: Apple, label: 'Diet & Homecare' },
        { path: '/documents', icon: ScanLine, label: 'Document Scanner' },
        { path: '/inventory', icon: Package, label: 'Inventory' },
        { path: '/prescriptions', icon: FileText, label: 'Prescriptions' },
    ];

    const mgmtItems = [
        { path: '/reports', icon: BarChart3, label: 'Reports' },
        { path: '/linked-entities', icon: Link2, label: 'Linked Entities' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="sidebar">
            <div className="logo-container">
                <div className="logo-icon">SC</div>
                <span className="logo-text">SmartClinic</span>
            </div>
            <div className="role-badge doctor-badge">
                <Stethoscope size={13} />
                <span>{user?.name || 'Doctor'}</span>
            </div>
            <nav>
                <span className="nav-section-title">Clinical</span>
                {clinicalItems.map((item) => (
                    <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                        <item.icon size={19} /><span>{item.label}</span>
                    </Link>
                ))}
                <span className="nav-section-title">Dispensary</span>
                {dispensaryItems.map((item) => (
                    <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                        <item.icon size={19} /><span>{item.label}</span>
                    </Link>
                ))}
                <span className="nav-section-title">Management</span>
                {mgmtItems.map((item) => (
                    <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                        <item.icon size={19} /><span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <button onClick={logout} className="logout-btn"><LogOut size={19} /><span>Logout</span></button>
        </aside>
    );
};

/* ═══════════════════════════════
   ASSISTANT SIDEBAR
   ═══════════════════════════════ */
const AssistantSidebar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const receptionItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/queue', icon: Calendar, label: 'Queue Manager' },
        { path: '/patients', icon: Users, label: 'Patients' },
        { path: '/billing', icon: Wallet, label: 'Billing' },
    ];

    const dispensaryItems = [
        { path: '/indoor-dispensary', icon: Syringe, label: 'Indoor Dispensary' },
        { path: '/outdoor-dispensary', icon: Pill, label: 'Outdoor Dispensary' },
        { path: '/documents', icon: ScanLine, label: 'Document Scanner' },
        { path: '/inventory', icon: Package, label: 'Inventory' },
        { path: '/prescriptions', icon: FileText, label: 'Prescriptions' },
        { path: '/pharmacy', icon: Pill, label: 'Pharmacy' },
    ];

    const mgmtItems = [
        { path: '/reports', icon: BarChart3, label: 'Reports' },
        { path: '/linked-entities', icon: Link2, label: 'Linked Entities' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="sidebar">
            <div className="logo-container">
                <div className="logo-icon">SC</div>
                <span className="logo-text">SmartClinic</span>
            </div>
            <div className="role-badge assistant-badge">
                <UserCog size={13} />
                <span>{user?.name || 'Receptionist'}</span>
            </div>
            <nav>
                <span className="nav-section-title">Reception</span>
                {receptionItems.map((item) => (
                    <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                        <item.icon size={19} /><span>{item.label}</span>
                    </Link>
                ))}
                <span className="nav-section-title">Dispensary</span>
                {dispensaryItems.map((item) => (
                    <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                        <item.icon size={19} /><span>{item.label}</span>
                    </Link>
                ))}
                <span className="nav-section-title">Management</span>
                {mgmtItems.map((item) => (
                    <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                        <item.icon size={19} /><span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <button onClick={logout} className="logout-btn"><LogOut size={19} /><span>Logout</span></button>
        </aside>
    );
};

/* ═══════════════════════════════
   PATIENT SIDEBAR
   ═══════════════════════════════ */
const PatientSidebar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'My Health' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="sidebar">
            <div className="logo-container">
                <div className="logo-icon"><Heart size={20} /></div>
                <span className="logo-text">MyClinic</span>
            </div>
            <div className="role-badge patient-badge">
                <User size={13} />
                <span>{user?.name || 'Patient'}</span>
            </div>
            <nav>
                <span className="nav-section-title">Patient Portal</span>
                {navItems.map((item) => (
                    <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                        <item.icon size={19} /><span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <button onClick={logout} className="logout-btn"><LogOut size={19} /><span>Logout</span></button>
        </aside>
    );
};

/* ═══════════════════════════════
   BOTTOM NAV — Mobile
   ═══════════════════════════════ */
const BottomNav = () => {
    const location = useLocation();
    const { isDoctor, isPatient } = useAuth();

    const doctorNav = [
        { path: '/', icon: LayoutDashboard, label: 'Home' },
        { path: '/queue', icon: Calendar, label: 'Queue' },
        { path: '/consultations', icon: Stethoscope, label: 'Consult' },
        { path: '/patients', icon: Users, label: 'Records' },
        { path: '/settings', icon: Settings, label: 'More' },
    ];

    const assistantNav = [
        { path: '/', icon: LayoutDashboard, label: 'Home' },
        { path: '/queue', icon: Calendar, label: 'Queue' },
        { path: '/patients', icon: Users, label: 'Patients' },
        { path: '/billing', icon: Wallet, label: 'Billing' },
        { path: '/settings', icon: Settings, label: 'More' },
    ];

    const patientNav = [
        { path: '/', icon: LayoutDashboard, label: 'My Health' },
        { path: '/settings', icon: Settings, label: 'More' },
    ];

    const navItems = isPatient ? patientNav : isDoctor ? doctorNav : assistantNav;

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <Link key={item.path} to={item.path} className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}>
                    <item.icon size={20} /><span>{item.label}</span>
                </Link>
            ))}
        </nav>
    );
};

/* ═══════════════════════════════
   PROTECTED LAYOUT
   ═══════════════════════════════ */
const ProtectedLayout = ({ children }) => {
    const { user, isDoctor, isPatient } = useAuth();
    if (!user) return <Navigate to="/login" />;

    const getSidebar = () => {
        if (isPatient) return <PatientSidebar />;
        if (isDoctor) return <DoctorSidebar />;
        return <AssistantSidebar />;
    };

    return (
        <div className="dashboard-layout">
            <div className="hidden-mobile">
                {getSidebar()}
            </div>
            <main className="content">{children}</main>
            <div className="visible-mobile"><BottomNav /></div>
        </div>
    );
};

/* ═══════════════════════════════
   ENTITY STORAGE HELPERS
   ═══════════════════════════════ */
const getEntities = () => JSON.parse(localStorage.getItem('scms_entities') || '[]');
const saveEntities = (entities) => localStorage.setItem('scms_entities', JSON.stringify(entities));

// Seed a default clinic + pharmacy on first load
const seedDefaults = () => {
    const existing = getEntities();
    if (existing.length === 0) {
        const defaults = [
            {
                id: 'CLINIC001', type: 'clinic', name: 'SmartClinic',
                address: 'MG Road, Mumbai - 400001', phone: '+91 98765 43210',
                doctor: 'Dr. Payal Patel', specialty: 'General Medicine',
                users: [
                    { role: 'doctor', userId: 'doc01', password: 'doc123', displayName: 'Dr. Payal Patel' },
                    { role: 'assistant', userId: 'asst01', password: 'asst123', displayName: 'Receptionist' },
                ],
                createdAt: new Date().toISOString(),
            }
        ];
        saveEntities(defaults);
        return defaults;
    }
    return existing;
};

/* ═══════════════════════════════
   LOGIN PAGE — Multi-Entity
   ═══════════════════════════════ */
const Login = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();

    const [entities, setEntities] = useState(() => seedDefaults());
    const [selectedEntityId, setSelectedEntityId] = useState(entities[0]?.id || '');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginTab, setLoginTab] = useState('doctor'); // 'doctor', 'assistant', or 'patient'

    // Theme state
    const [isDark, setIsDark] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('scms_settings')) || {};
            return saved.theme === 'dark';
        } catch { return false; }
    });

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        try {
            const saved = JSON.parse(localStorage.getItem('scms_settings')) || {};
            saved.theme = newDark ? 'dark' : 'light';
            localStorage.setItem('scms_settings', JSON.stringify(saved));
        } catch {}
        if (newDark) document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
    };

    // Registration modal state
    const [showRegister, setShowRegister] = useState(false);
    const [regForm, setRegForm] = useState({
        name: '', address: '', phone: '',
        doctorName: '', specialty: 'General Medicine',
        docUserId: '', docPassword: '',
        asstUserId: '', asstPassword: ''
    });

    if (user) return <Navigate to="/" />;

    const selectedEntity = entities.find(e => e.id === selectedEntityId);
    const clinics = entities.filter(e => e.type === 'clinic');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (loginTab !== 'patient' && !selectedEntityId) { setError('Please select a clinic.'); return; }
        setIsLoading(true);

        try {
            if (loginTab === 'patient') {
                const patientsList = JSON.parse(localStorage.getItem('patients') || '[]');
                const matchedPatient = patientsList.find(
                    p => (p.mobile === userId.trim() || p.id === userId.trim()) && p.id === password.trim()
                );

                if (matchedPatient) {
                    await login(matchedPatient.name, 'patient', selectedEntityId || 'CLINIC001');
                    // Ensure the core name is set correctly
                    const userObj = JSON.parse(localStorage.getItem('scms_user'));
                    userObj.id = matchedPatient.id;
                    userObj.name = matchedPatient.name;
                    localStorage.setItem('scms_user', JSON.stringify(userObj));
                    window.location.href = '/';
                    return;
                } else {
                    setError('Invalid Patient ID or Mobile Number.');
                }
            } else {
                const matchedUser = selectedEntity.users.find(
                    u => u.userId === userId.trim() && u.password === password && u.role === loginTab
                );

                if (matchedUser) {
                    await login(matchedUser.displayName, matchedUser.role, selectedEntity.id);
                    navigate('/');
                } else {
                    setError('Invalid User ID or Password.');
                }
            }
        } catch (err) {
            setError('An error occurred during sign-in.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const newId = `CLN${String(Date.now()).slice(-6)}`;

        const newEntity = {
            id: newId, type: 'clinic', name: regForm.name,
            address: regForm.address, phone: regForm.phone,
            doctor: regForm.doctorName, specialty: regForm.specialty,
            users: [
                { role: 'doctor', userId: regForm.docUserId || 'doctor', password: regForm.docPassword || '1234', displayName: regForm.doctorName || 'Doctor' },
                { role: 'assistant', userId: regForm.asstUserId || 'asst', password: regForm.asstPassword || '1234', displayName: 'Receptionist' },
            ],
            createdAt: new Date().toISOString(),
        };

        const updated = [...entities, newEntity];
        saveEntities(updated);
        setEntities(updated);
        setSelectedEntityId(newId);
        setShowRegister(false);
        setRegForm({ name: '', address: '', phone: '', doctorName: '', specialty: 'General Medicine', docUserId: '', docPassword: '', asstUserId: '', asstPassword: '' });
    };

    return (
        <div className="login-container">
            {/* Top Right Actions */}
            <div className="login-actions-top">
                <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* ── Registration Modal ── */}
            {showRegister && (
                <div className="modal-overlay" onClick={() => setShowRegister(false)}>
                    <div className="modal-content modal-lg animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>🏥 Register New Clinic</h2>
                            <button className="modal-close-btn" onClick={() => setShowRegister(false)}>✕</button>
                        </div>
                        <form onSubmit={handleRegister}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Clinic Name *</label>
                                    <input required type="text" placeholder="e.g. City Care Clinic"
                                        value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="text" placeholder="+91 98765 43210"
                                        value={regForm.phone} onChange={e => setRegForm({ ...regForm, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input type="text" placeholder="Full address"
                                    value={regForm.address} onChange={e => setRegForm({ ...regForm, address: e.target.value })} />
                            </div>

                            <h4 className="font-bold text-sm mt-4 mb-2 flex items-center gap-2">
                                <Stethoscope size={14} className="text-primary" /> Doctor Credentials
                            </h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Doctor Name *</label>
                                    <input required type="text" placeholder="Dr. Name"
                                        value={regForm.doctorName} onChange={e => setRegForm({ ...regForm, doctorName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Specialty</label>
                                    <input type="text" placeholder="General Medicine"
                                        value={regForm.specialty} onChange={e => setRegForm({ ...regForm, specialty: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Doctor User ID *</label>
                                    <input required type="text" placeholder="e.g. doc02"
                                        value={regForm.docUserId} onChange={e => setRegForm({ ...regForm, docUserId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Doctor Password *</label>
                                    <input required type="text" placeholder="e.g. pass123"
                                        value={regForm.docPassword} onChange={e => setRegForm({ ...regForm, docPassword: e.target.value })} />
                                </div>
                            </div>
                            <h4 className="font-bold text-sm mt-4 mb-2 flex items-center gap-2">
                                <UserCog size={14} style={{ color: '#10b981' }} /> Assistant Credentials
                            </h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Assistant User ID *</label>
                                    <input required type="text" placeholder="e.g. asst02"
                                        value={regForm.asstUserId} onChange={e => setRegForm({ ...regForm, asstUserId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Assistant Password *</label>
                                    <input required type="text" placeholder="e.g. pass123"
                                        value={regForm.asstPassword} onChange={e => setRegForm({ ...regForm, asstPassword: e.target.value })} />
                                </div>
                            </div>

                            <button type="submit" className="primary-btn mt-4" style={{ width: '100%' }}>
                                🏥 Register Clinic
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="login-split-card">
                {/* ── Visual Side ── */}
                <div className="login-visual-panel">
                    <div className="visual-overlay"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1631217818242-aa0a703c726d?q=80&w=2070&auto=format&fit=crop" 
                        alt="Medical Workspace" 
                        className="visual-image" 
                    />
                    <div className="visual-content">
                        <div className="visual-logo">
                            <Stethoscope size={32} />
                            <span>SmartClinic</span>
                        </div>
                        <h2>The Intelligent Core <br/> of your Medical Practice.</h2>
                        <p>Streamline patient care, manage records effortlessly, and focus on what matters most—healing.</p>
                        
                        <div className="visual-features">
                            <div className="v-feature">
                                <Shield size={18} />
                                <span>HIPAA Compliant Security</span>
                            </div>
                            <div className="v-feature">
                                <LayoutDashboard size={18} />
                                <span>Intelligent Dashboards</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Form Side ── */}
                <div className="login-form-panel">
                    <div className="login-form-header">
                        <h1>Welcome Back</h1>
                        <p>Access your workspace as a doctor, staff, or patient</p>
                    </div>

                    <div className="login-type-switch">
                        <button 
                            className={`switch-btn ${loginTab === 'doctor' ? 'active' : ''}`}
                            onClick={() => { setLoginTab('doctor'); setError(''); }}
                        >
                            <Stethoscope size={18} />
                            <span>Doctor</span>
                        </button>
                        <button 
                            className={`switch-btn ${loginTab === 'assistant' ? 'active' : ''}`}
                            onClick={() => { setLoginTab('assistant'); setError(''); }}
                        >
                            <UserCog size={18} />
                            <span>Staff</span>
                        </button>
                        <button 
                            className={`switch-btn ${loginTab === 'patient' ? 'active' : ''}`}
                            onClick={() => { setLoginTab('patient'); setError(''); }}
                        >
                            <Users size={18} />
                            <span>Patient</span>
                        </button>
                    </div>

                    <form className="modern-login-form" onSubmit={handleLogin}>
                        {loginTab !== 'patient' && (
                            <div className="form-group">
                                <label>Selected Clinic</label>
                                <div className="select-wrapper">
                                    <select
                                        value={selectedEntityId}
                                        onChange={e => { setSelectedEntityId(e.target.value); setError(''); }}
                                    >
                                        {clinics.map(c => <option key={c.id} value={c.id}>{c.name} — {c.id}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label>{loginTab === 'patient' ? 'Mobile / Patient ID' : `${loginTab.charAt(0).toUpperCase() + loginTab.slice(1)} User ID`}</label>
                            <div className="input-with-icon">
                                <User className="input-icon" size={18} />
                                <input 
                                    required 
                                    type="text" 
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder={loginTab === 'patient' ? "e.g. 9876543210" : `Your ${loginTab} unique ID`}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="label-row">
                                <label>Password</label>
                                <span className="forgot-link">Forgot?</span>
                            </div>
                            <div className="input-with-icon">
                                <Shield className="input-icon" size={18} />
                                <input 
                                    required 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={loginTab === 'patient' ? "Enter your ID" : "••••••••"}
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && <div className="login-error-msg">{error}</div>}

                        <button type="submit" className="login-submit-btn" disabled={isLoading}>
                            {isLoading ? (
                                <span className="loader-dots">Authenticating</span>
                            ) : (
                                <>Sign In to Workspace <LogOut size={18} /></>
                            )}
                        </button>

                        {loginTab !== 'patient' && (
                            <div className="login-divider">
                                <span>New Clinic?</span>
                                <button type="button" onClick={() => setShowRegister(true)} className="register-link">Register Clinic</button>
                            </div>
                        )}
                        
                        <div className="demo-credentials-hint">
                            <p><strong>Demo:</strong> doc01 / doc123 (SmartClinic)</p>
                        </div>
                    </form>
                    
                    <footer className="login-footer">
                        &copy; 2026 SmartClinic Labs. All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════
   APP ROOT — Role-based Routes
   ═══════════════════════════════ */
const AppRoutes = () => {
    const { isDoctor, isAssistant, isPatient } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Dashboard — role-aware */}
            <Route path="/" element={
                <ProtectedLayout>
                    {isPatient ? <PatientDashboard /> : <Dashboard />}
                </ProtectedLayout>
            } />

            {/* Shared clinic pages (Doctor + Assistant) */}
            <Route path="/queue" element={<ProtectedLayout><Queue /></ProtectedLayout>} />
            <Route path="/patients" element={<ProtectedLayout><Patients /></ProtectedLayout>} />
            <Route path="/reports" element={<ProtectedLayout><Reports /></ProtectedLayout>} />
            <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />

            {/* Dispensary — shared between Doctor and Assistant */}
            <Route path="/indoor-dispensary" element={<ProtectedLayout><IndoorDispensary /></ProtectedLayout>} />
            <Route path="/outdoor-dispensary" element={<ProtectedLayout><OutdoorDispensary /></ProtectedLayout>} />
            <Route path="/documents" element={<ProtectedLayout><DocumentScanner /></ProtectedLayout>} />

            {/* Doctor-only */}
            <Route path="/consultations" element={
                <ProtectedLayout>
                    {isDoctor ? <Consultation /> : <Navigate to="/" />}
                </ProtectedLayout>
            } />
            <Route path="/diet-templates" element={
                <ProtectedLayout>
                    {isDoctor ? <DietTemplates /> : <Navigate to="/" />}
                </ProtectedLayout>
            } />

            {/* Assistant-only */}
            <Route path="/billing" element={
                <ProtectedLayout>
                    {isAssistant ? <Billing /> : <Navigate to="/" />}
                </ProtectedLayout>
            } />

            {/* Shared: Inventory & Prescriptions (Doctor + Assistant) */}
            <Route path="/inventory" element={<ProtectedLayout><Inventory /></ProtectedLayout>} />
            <Route path="/prescriptions" element={<ProtectedLayout><Prescriptions /></ProtectedLayout>} />
            <Route path="/linked-entities" element={<ProtectedLayout><LinkedEntities /></ProtectedLayout>} />
            <Route path="/pharmacy" element={<ProtectedLayout><PharmacyDashboard /></ProtectedLayout>} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

function App() {
    // One-time migration + apply persisted settings on startup
    useEffect(() => {
        ['scms_entities', 'scms_user', 'scms_patients', 'scms_queue', 'store_prescriptions', 'store_inventory'].forEach(key => {
            const data = localStorage.getItem(key);
            if (data && data.includes('Dr. Sharma')) {
                localStorage.setItem(key, data.replace(/Dr\. Sharma/g, 'Dr. Payal Patel'));
            }
        });
        // Apply persisted appearance settings
        applySettings(loadSettings());
    }, []);

    // Scroll to top on route change
    const ScrollToTop = () => {
        const { pathname } = useLocation();
        useEffect(() => {
            window.scrollTo(0, 0);
        }, [pathname]);
        return null;
    };

    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <ToastContainer />
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
