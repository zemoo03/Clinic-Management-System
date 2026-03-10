import { useState } from 'react';
import { Building2, Clock, Bell, Shield, Palette, Globe, UserCircle, Phone, MapPin, Mail, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { showToast } from '../components/Toast';

const Settings = () => {
    const { user } = useAuth();

    const [clinicSettings, setClinicSettings] = useState({
        clinicName: 'SmartClinic',
        doctorName: user?.name || 'Dr. Payal Patel',
        specialty: 'General Medicine',
        phone: '+91 98765 43210',
        email: user?.email || 'doctor@clinic.com',
        address: 'MG Road, Mumbai, Maharashtra',
        morningSlot: '09:00 - 13:00',
        eveningSlot: '17:00 - 21:00',
        consultationFee: 300,
        followUpFee: 200,
        upiId: 'doctor@upi',
    });

    const [notifications, setNotifications] = useState({
        sms: true,
        whatsapp: false,
        email: true,
        sound: true,
    });

    const [appearance, setAppearance] = useState({
        theme: 'light',
        accentColor: 'indigo',
        compactMode: false,
    });

    const handleSave = () => {
        showToast('Settings saved successfully!', 'success');
    };

    const Toggle = ({ active, onChange }) => (
        <div className={`toggle ${active ? 'active' : ''}`} onClick={onChange}></div>
    );

    return (
        <div className="animate-fade-in">
            <PageHeader title="Settings" subtitle="Manage your clinic and account preferences">
                <button className="primary-btn-sm" onClick={handleSave}>
                    <Save size={15} /> Save Changes
                </button>
            </PageHeader>

            <div className="settings-grid">
                {/* Clinic Profile */}
                <div className="settings-card glass">
                    <h3><Building2 size={18} className="text-primary" /> Clinic Profile</h3>

                    <div className="form-group">
                        <label>Clinic Name</label>
                        <input
                            type="text"
                            value={clinicSettings.clinicName}
                            onChange={e => setClinicSettings({ ...clinicSettings, clinicName: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Doctor Name</label>
                        <input
                            type="text"
                            value={clinicSettings.doctorName}
                            onChange={e => setClinicSettings({ ...clinicSettings, doctorName: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Specialty</label>
                        <select
                            value={clinicSettings.specialty}
                            onChange={e => setClinicSettings({ ...clinicSettings, specialty: e.target.value })}
                        >
                            <option>General Medicine</option>
                            <option>Pediatrics</option>
                            <option>Dermatology</option>
                            <option>Orthopedics</option>
                            <option>ENT</option>
                            <option>Ophthalmology</option>
                            <option>Gynecology</option>
                            <option>Dentistry</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            value={clinicSettings.address}
                            onChange={e => setClinicSettings({ ...clinicSettings, address: e.target.value })}
                        />
                    </div>
                </div>

                {/* Contact & Timings */}
                <div className="settings-card glass">
                    <h3><Clock size={18} className="text-primary" /> Contact & Timings</h3>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            value={clinicSettings.phone}
                            onChange={e => setClinicSettings({ ...clinicSettings, phone: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={clinicSettings.email}
                            onChange={e => setClinicSettings({ ...clinicSettings, email: e.target.value })}
                        />
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Morning Slot</label>
                            <input
                                type="text"
                                value={clinicSettings.morningSlot}
                                onChange={e => setClinicSettings({ ...clinicSettings, morningSlot: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Evening Slot</label>
                            <input
                                type="text"
                                value={clinicSettings.eveningSlot}
                                onChange={e => setClinicSettings({ ...clinicSettings, eveningSlot: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Consultation Fee (₹)</label>
                            <input
                                type="number"
                                value={clinicSettings.consultationFee}
                                onChange={e => setClinicSettings({ ...clinicSettings, consultationFee: Number(e.target.value) })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Follow-up Fee (₹)</label>
                            <input
                                type="number"
                                value={clinicSettings.followUpFee}
                                onChange={e => setClinicSettings({ ...clinicSettings, followUpFee: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="settings-card glass">
                    <h3><Bell size={18} className="text-primary" /> Notifications</h3>

                    <div className="setting-row">
                        <span className="setting-label">SMS Notifications</span>
                        <Toggle active={notifications.sms} onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })} />
                    </div>
                    <div className="setting-row">
                        <span className="setting-label">WhatsApp Alerts</span>
                        <Toggle active={notifications.whatsapp} onChange={() => setNotifications({ ...notifications, whatsapp: !notifications.whatsapp })} />
                    </div>
                    <div className="setting-row">
                        <span className="setting-label">Email Notifications</span>
                        <Toggle active={notifications.email} onChange={() => setNotifications({ ...notifications, email: !notifications.email })} />
                    </div>
                    <div className="setting-row">
                        <span className="setting-label">Queue Sound Alert</span>
                        <Toggle active={notifications.sound} onChange={() => setNotifications({ ...notifications, sound: !notifications.sound })} />
                    </div>
                </div>

                {/* Appearance */}
                <div className="settings-card glass">
                    <h3><Palette size={18} className="text-primary" /> Appearance</h3>

                    <div className="setting-row">
                        <span className="setting-label">Theme</span>
                        <span className="setting-value">
                            <select
                                value={appearance.theme}
                                onChange={e => setAppearance({ ...appearance, theme: e.target.value })}
                                style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark (Coming Soon)</option>
                            </select>
                        </span>
                    </div>
                    <div className="setting-row">
                        <span className="setting-label">Compact Mode</span>
                        <Toggle active={appearance.compactMode} onChange={() => setAppearance({ ...appearance, compactMode: !appearance.compactMode })} />
                    </div>
                    <div className="setting-row">
                        <span className="setting-label">Accent Color</span>
                        <div className="flex gap-2">
                            {['indigo', 'blue', 'emerald', 'rose'].map(color => {
                                const colors = { indigo: '#4f46e5', blue: '#3b82f6', emerald: '#10b981', rose: '#f43f5e' };
                                return (
                                    <div
                                        key={color}
                                        onClick={() => setAppearance({ ...appearance, accentColor: color })}
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: colors[color],
                                            cursor: 'pointer',
                                            border: appearance.accentColor === color ? '3px solid var(--text-main)' : '3px solid transparent',
                                            outline: appearance.accentColor === color ? '2px solid var(--surface)' : 'none',
                                            transition: 'all 0.2s'
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-background rounded-xl">
                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                            <Shield size={14} className="text-primary" /> Account
                        </h4>
                        <p className="text-sm text-muted mb-1">Clinic Code: <strong className="font-mono">{user?.clinicId || 'CLINIC001'}</strong></p>
                        <p className="text-sm text-muted mb-1">Plan: <strong className="text-primary">{user?.subscription || 'Free'}</strong></p>
                        <p className="text-sm text-muted">Role: <strong>{user?.role || 'Doctor'}</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
