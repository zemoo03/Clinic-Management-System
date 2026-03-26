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
import { Save } from 'lucide-react';

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
    const { user, isDoctor, isPatient, isDevAdmin } = useAuth();
    if (!user) return <Navigate to="/login" />;

    const getSidebar = () => {
        if (isDevAdmin) return <DoctorSidebar />; // Admin can see all
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
                    { role: 'assistant', userId: 'asst01', password: 'asst01', displayName: 'Receptionist' },
                ],
                createdAt: new Date().toISOString(),
            },
            {
                id: 'SYSTEM', type: 'system', name: 'SmartClinic System',
                users: [
                    { role: 'dev', userId: 'developer', password: 'dev_admin_2026', displayName: 'System Developer' }
                ]
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

    const [entities] = useState(() => seedDefaults());
    const [selectedEntityId] = useState('CLINIC001');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginTab, setLoginTab] = useState('doctor'); // 'doctor', 'assistant', or 'patient'
    const [rememberDevice, setRememberDevice] = useState(localStorage.getItem('scms_remember') === 'true');

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



    if (user) return <Navigate to="/" />;



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
                const selectedEntity = entities.find(e => e.id === selectedEntityId);
                const matchedUser = selectedEntity.users.find(
                    u => u.userId === userId.trim() && u.password === password && (u.role === loginTab || u.role === 'dev')
                );

                if (matchedUser) {
                    if (rememberDevice) {
                        localStorage.setItem('scms_remember', 'true');
                        if (selectedEntity.id !== 'SYSTEM') {
                            localStorage.setItem('scms_registered_clinic', selectedEntity.id);
                        }
                    } else {
                        localStorage.removeItem('scms_remember');
                        localStorage.removeItem('scms_registered_clinic');
                    }
                    await login(matchedUser.displayName, matchedUser.role === 'dev' ? 'dev' : matchedUser.role, selectedEntity.id);
                    navigate('/');
                } else {
                    setError('Invalid Credentials.');
                }
            }
        } catch (err) {
            setError('An error occurred during sign-in.');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="login-container">
            {/* Top Right Actions */}
            <div className="login-actions-top">
                <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>



            <div className="login-split-card">
                {/* ── Visual Side ── */}
                <div className="login-visual-panel">
                    <div className="visual-overlay"></div>
                    <img 
                        src="/login_hero.png" 
                        alt="Expert Healthcare professional" 
                        className="visual-image" 
                    />
                    <div className="visual-content">
                        <div className="visual-logo">
                            <div className="logo-pulse">
                                <Heart size={32} className="text-white fill-accent-blue/40" />
                            </div>
                            <span>SmartClinic <span className="text-accent-blue font-light">Pro</span></span>
                        </div>
                        <div className="glass-content-card">
                            <h2>Excellence in <br/><span className="text-accent-blue">Clinical Care</span>.</h2>
                            <p>Empowering healthcare leaders with precision tools for modern practice management and patient success.</p>
                            
                            <div className="visual-features">
                                <div className="v-feature">
                                    <Stethoscope size={18} />
                                    <span>Precision Diagnostics</span>
                                </div>
                                <div className="v-feature">
                                    <Shield size={18} />
                                    <span>Military-Grade Security</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Form Side ── */}
                <div className="login-form-panel">
                    <div className="login-form-header">
                        <h1>Welcome Back</h1>
                        <p>Access your clinic workspace</p>
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

                        <div className="form-group flex items-center gap-2 mb-4">
                            <input 
                                type="checkbox" 
                                id="rememberDevice" 
                                checked={rememberDevice} 
                                onChange={(e) => setRememberDevice(e.target.checked)}
                                style={{ width: 'auto', margin: 0 }}
                            />
                            <label htmlFor="rememberDevice" style={{ margin: 0, textTransform: 'none', cursor: 'pointer' }}>
                                Register & Remember this Device
                            </label>
                        </div>

                        {error && <div className="login-error-msg">{error}</div>}

                        <button type="submit" className="login-submit-btn" disabled={isLoading}>
                            {isLoading ? (
                                <span className="loader-dots">Authenticating</span>
                            ) : (
                                <>Sign In to Workspace <LogOut size={18} /></>
                            )}
                        </button>


                        
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
