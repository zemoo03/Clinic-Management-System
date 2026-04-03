import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
    Heart, 
    Shield, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight,
    Stethoscope,
    Users,
    UserCog
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import '../styles/login.css';

const LoginPage = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const { theme } = useUI();
    
    const [userId, setUserId] = useState('doc01');
    const [password, setPassword] = useState('doc123');
    const [role, setRole] = useState('doctor');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (user) return <Navigate to="/" />;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Mock authentication
            const matched = (userId === 'doc01' && password === 'doc123' && role === 'doctor') ||
                           (userId === 'asst01' && password === 'asst01' && role === 'assistant');
                            // Patient demo mapping (connects to PatientDashboard DEMO_PATIENTS ids)
                            const patientMatched = (userId === 'pat01' && password === 'pat01' && role === 'patient');
            
            if (matched || patientMatched) {
                if (role === 'patient') {
                    await login('Rahul Verma', role, 'CLINIC001', 'PAT001');
                } else {
                    await login(role === 'doctor' ? 'Dr. Payal Patel' : 'Receptionist', role);
                }
                navigate('/');
            } else {
                setError('Invalid credentials for the selected role.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Left Panel: Visual Branding */}
            <div className="login-visual">
                <div className="clinic-bg-wrapper"></div>
                <div className="visual-gradient-overlay"></div>
                <div className="visual-content px-12">
                     <div className="flex flex-col items-center gap-6">
                         <div className="logo-icon-premium">
                             <Heart size={38} fill="currentColor" />
                         </div>
                         <h1 className="brand-name-left">MediCore</h1>
                         <div className="h-1 w-16 bg-white/40 rounded-full"></div>
                         <p className="brand-tagline-left">Premium Healthcare Platform</p>
                     </div>
                </div>
            </div>

            {/* Right Panel: Sign-In Form */}
            <div className="login-form-container">
                <div className="form-inner animate-fade-in">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-main tracking-tight mb-2">Sign in</h2>
                        <p className="text-sm text-faint font-medium">Welcome back! Please sign in to continue.</p>
                    </div>

                    <button type="button" className="google-btn mb-6">
                        <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="google-icon" />
                        <span>Continue with Google</span>
                    </button>

                    <div className="divider-wrapper mb-6">
                        <span className="divider-text">or</span>
                    </div>

                    <div className="role-selector mb-6">
                        <button 
                            className={`role-btn-sm ${role === 'doctor' ? 'active' : ''}`}
                            onClick={() => setRole('doctor')}
                        >
                            <span>Doctor</span>
                        </button>
                        <button 
                            className={`role-btn-sm ${role === 'assistant' ? 'active' : ''}`}
                            onClick={() => setRole('assistant')}
                        >
                            <span>Staff</span>
                        </button>
                        <button 
                            className={`role-btn-sm ${role === 'patient' ? 'active' : ''}`}
                            onClick={() => setRole('patient')}
                        >
                            <span>Patient</span>
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="form-group">
                            <label className="text-xs font-bold uppercase tracking-wider text-faint mb-2 block">Email address / ID</label>
                            <input 
                                type="text" 
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="login-input-simple"
                                placeholder="hello@medicore.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-faint block">Password</label>
                                <span className="text-primary text-xs font-bold cursor-pointer hover:underline">Forgot password?</span>
                            </div>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="login-input-simple pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-main"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {error && <div className="error-msg text-xs py-2">{error}</div>}

                        <button type="submit" className="login-btn-primary-new" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Continue"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-faint">
                        Don't have an account? <span className="text-primary cursor-pointer hover:underline">Sign up</span>
                    </p>

                    <footer className="mt-16 text-center">
                        <p className="text-[10px] text-faint uppercase tracking-widest font-bold">
                            &copy; MediCore &middot; Privacy &middot; Terms
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
