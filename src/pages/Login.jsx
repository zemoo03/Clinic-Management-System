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
            
            if (matched) {
                await login(role === 'doctor' ? 'Dr. Payal Patel' : 'Receptionist', role);
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
            {/* Split Layout */}
            <div className="login-visual text-white">
                <div className="visual-overlay"></div>
                <div className="visual-content">
                    <div className="logo mb-12">
                         <div className="logo-icon bg-white text-primary">
                             <Heart size={28} fill="currentColor" />
                         </div>
                         <h2 className="text-3xl font-black ml-4">MediCore Pro</h2>
                    </div>
                    
                    <div className="glass p-10 rounded-3xl border-white/20">
                        <h1 className="text-5xl font-black mb-6 leading-tight">Elevate Your <br/><span className="text-primary-light">Medical Practice</span>.</h1>
                        <p className="text-lg opacity-90 mb-10 leading-relaxed font-medium">The most intuitive platform for managing your clinic, patients, and growth — all in one unified workspace.</p>
                        
                        <div className="flex gap-6">
                            <div className="flex items-center gap-3">
                                <Shield className="text-primary-light" />
                                <span className="font-bold">Next-Gen Security</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="text-primary-light" />
                                <span className="font-bold">Patient Success</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-form-container">
                <div className="form-card animate-fade-in">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-main mb-2">Welcome Back</h2>
                        <p className="text-faint font-medium">Please enter your workspace details</p>
                    </div>

                    <div className="role-selector mb-8">
                        <button 
                            className={`role-btn ${role === 'doctor' ? 'active' : ''}`}
                            onClick={() => setRole('doctor')}
                        >
                            <Stethoscope size={18} />
                            <span>Doctor</span>
                        </button>
                        <button 
                            className={`role-btn ${role === 'assistant' ? 'active' : ''}`}
                            onClick={() => setRole('assistant')}
                        >
                            <UserCog size={18} />
                            <span>Staff</span>
                        </button>
                        <button 
                            className={`role-btn ${role === 'patient' ? 'active' : ''}`}
                            onClick={() => setRole('patient')}
                        >
                            <Users size={18} />
                            <span>Patient</span>
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="form-group">
                            <label>Username / ID</label>
                            <div className="input-icon-wrapper">
                                <Mail className="icon" size={18} />
                                <input 
                                    type="text" 
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="Enter your unique ID"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="flex justify-between items-center mb-1">
                                <label>Password</label>
                                <span className="text-primary text-xs font-bold cursor-pointer hover:underline">Forgot password?</span>
                            </div>
                            <div className="input-icon-wrapper">
                                <Lock className="icon" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && <div className="error-msg">{error}</div>}

                        <button type="submit" className="login-btn-submit" disabled={isLoading}>
                            {isLoading ? "Validating Workspace..." : (
                                <span className="flex items-center gap-2">
                                    Sign In <ArrowRight size={20} />
                                </span>
                            )}
                        </button>
                    </form>

                    <footer className="mt-12 text-center">
                        <p className="text-xs text-faint font-medium">
                            &copy; 2026 MediCore Technologies. All rights reserved.
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
