import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
    LayoutDashboard, Users, Calendar, ClipboardList, Wallet, BarChart3,
    Settings, LogOut, Package, FileText, Link2, Store, Building2
} from 'lucide-react';
import { useState } from 'react';
import { ToastContainer } from './components/Toast';

// Clinic Pages
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Consultation from './pages/Consultation';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';

// Medical Store Pages
import PharmacyDashboard from './pages/PharmacyDashboard';
import Inventory from './pages/Inventory';
import Prescriptions from './pages/Prescriptions';

// Shared Pages
import LinkedEntities from './pages/LinkedEntities';

/* ═══════════════════════════════
   CLINIC SIDEBAR
   ═══════════════════════════════ */
const ClinicSidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const mainNav = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/appointments', icon: Calendar, label: 'Appointments' },
        { path: '/patients', icon: Users, label: 'Patients' },
        { path: '/consultations', icon: ClipboardList, label: 'Consultation' },
    ];

    const secondaryNav = [
        { path: '/billing', icon: Wallet, label: 'Billing' },
        { path: '/reports', icon: BarChart3, label: 'Reports' },
        { path: '/linked-stores', icon: Store, label: 'Linked Stores' },
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
            <nav>
                <span className="nav-section-title">Main Menu</span>
                {mainNav.map((item) => (
                    <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                        <item.icon size={19} /><span>{item.label}</span>
                    </Link>
                ))}
                <span className="nav-section-title">Management</span>
                {secondaryNav.map((item) => (
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
   STORE SIDEBAR
   ═══════════════════════════════ */
const StoreSidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const mainNav = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/inventory', icon: Package, label: 'Inventory' },
        { path: '/prescriptions', icon: FileText, label: 'Prescriptions' },
    ];

    const secondaryNav = [
        { path: '/linked-clinics', icon: Building2, label: 'Linked Clinics' },
        { path: '/billing', icon: Wallet, label: 'Billing' },
        { path: '/reports', icon: BarChart3, label: 'Reports' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="sidebar sidebar-store">
            <div className="logo-container">
                <div className="logo-icon store-logo">MP</div>
                <span className="logo-text">MedPlus</span>
            </div>
            <nav>
                <span className="nav-section-title">Pharmacy</span>
                {mainNav.map((item) => (
                    <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                        <item.icon size={19} /><span>{item.label}</span>
                    </Link>
                ))}
                <span className="nav-section-title">Management</span>
                {secondaryNav.map((item) => (
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
    const { isClinic } = useAuth();

    const clinicNav = [
        { path: '/', icon: LayoutDashboard, label: 'Home' },
        { path: '/patients', icon: Users, label: 'Patients' },
        { path: '/appointments', icon: Calendar, label: 'Queue' },
        { path: '/consultations', icon: ClipboardList, label: 'Consult' },
        { path: '/settings', icon: Settings, label: 'More' },
    ];

    const storeNav = [
        { path: '/', icon: LayoutDashboard, label: 'Home' },
        { path: '/inventory', icon: Package, label: 'Inventory' },
        { path: '/prescriptions', icon: FileText, label: 'Rx' },
        { path: '/linked-clinics', icon: Building2, label: 'Clinics' },
        { path: '/settings', icon: Settings, label: 'More' },
    ];

    const navItems = isClinic ? clinicNav : storeNav;

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
    const { user, isClinic } = useAuth();
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="dashboard-layout">
            <div className="hidden-mobile">
                {isClinic ? <ClinicSidebar /> : <StoreSidebar />}
            </div>
            <main className="content">{children}</main>
            <div className="visible-mobile"><BottomNav /></div>
        </div>
    );
};

/* ═══════════════════════════════
   LOGIN PAGE — with Clinic / Store toggle
   ═══════════════════════════════ */
const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('doctor@clinic.com');
    const [password, setPassword] = useState('');
    const [entityCode, setEntityCode] = useState('CLINIC001');
    const [entityType, setEntityType] = useState('clinic'); // 'clinic' or 'store'
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password || 'demo', entityCode, entityType);
        } catch {
            // Error handled inside login
        }
        setIsLoading(false);
    };

    const switchEntityType = (type) => {
        setEntityType(type);
        if (type === 'clinic') {
            setEntityCode('CLINIC001');
            setEmail('doctor@clinic.com');
        } else {
            setEntityCode('STORE001');
            setEmail('store@medplus.com');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card animate-fade-in">
                <div className="logo-container centered">
                    <div className={`logo-icon large ${entityType === 'store' ? 'store-logo' : ''}`}>
                        {entityType === 'clinic' ? 'SC' : 'MP'}
                    </div>
                    <h2>Welcome Back</h2>
                    <p className="login-subtitle">
                        Sign in to your {entityType === 'clinic' ? 'clinic' : 'medical store'} dashboard
                    </p>
                </div>

                {/* Entity Type Toggle */}
                <div className="entity-toggle">
                    <button
                        type="button"
                        className={`entity-toggle-btn ${entityType === 'clinic' ? 'active' : ''}`}
                        onClick={() => switchEntityType('clinic')}
                    >
                        <Building2 size={16} />
                        <span>Clinic</span>
                    </button>
                    <button
                        type="button"
                        className={`entity-toggle-btn ${entityType === 'store' ? 'active' : ''}`}
                        onClick={() => switchEntityType('store')}
                    >
                        <Store size={16} />
                        <span>Medical Store</span>
                    </button>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>{entityType === 'clinic' ? 'Clinic Code' : 'Store Code'}</label>
                        <input
                            type="text"
                            value={entityCode}
                            onChange={(e) => setEntityCode(e.target.value)}
                            placeholder={entityType === 'clinic' ? 'e.g. CLINIC001' : 'e.g. STORE001'}
                            className="uppercase tracking-widest font-mono"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <button type="submit" className="primary-btn" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : `Sign In as ${entityType === 'clinic' ? 'Clinic' : 'Store'}`}
                    </button>
                    <p className="forgot-password text-center mt-4">
                        Register your {entityType === 'clinic' ? 'clinic' : 'medical store'}?
                    </p>
                </form>
            </div>
        </div>
    );
};

/* ═══════════════════════════════
   APP ROOT — Routes for both entity types
   ═══════════════════════════════ */
const AppRoutes = () => {
    const { isClinic, isStore } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Dashboard — different for each entity type */}
            <Route path="/" element={
                <ProtectedLayout>
                    {isStore ? <PharmacyDashboard /> : <Dashboard />}
                </ProtectedLayout>
            } />

            {/* Clinic-specific routes */}
            <Route path="/patients" element={<ProtectedLayout><Patients /></ProtectedLayout>} />
            <Route path="/appointments" element={<ProtectedLayout><Appointments /></ProtectedLayout>} />
            <Route path="/consultations" element={<ProtectedLayout><Consultation /></ProtectedLayout>} />

            {/* Store-specific routes */}
            <Route path="/inventory" element={<ProtectedLayout><Inventory /></ProtectedLayout>} />
            <Route path="/prescriptions" element={<ProtectedLayout><Prescriptions /></ProtectedLayout>} />

            {/* Shared routes */}
            <Route path="/billing" element={<ProtectedLayout><Billing /></ProtectedLayout>} />
            <Route path="/reports" element={<ProtectedLayout><Reports /></ProtectedLayout>} />
            <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
            <Route path="/linked-stores" element={<ProtectedLayout><LinkedEntities /></ProtectedLayout>} />
            <Route path="/linked-clinics" element={<ProtectedLayout><LinkedEntities /></ProtectedLayout>} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <ToastContainer />
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
