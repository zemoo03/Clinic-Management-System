import React from 'react';
import { 
    Users, 
    Calendar, 
    Activity, 
    ArrowUpRight, 
    ArrowDownRight,
    TrendingUp,
    MoreHorizontal,
    Plus
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import AppointmentCalendar from '../components/AppointmentCalendar';

import '../styles/dashboard.css';


const data = [
    { name: 'Mon', patients: 40 },
    { name: 'Tue', patients: 30 },
    { name: 'Wed', patients: 65 },
    { name: 'Thu', patients: 45 },
    { name: 'Fri', patients: 85 },
    { name: 'Sat', patients: 70 },
    { name: 'Sun', patients: 35 },
];

const StatCard = ({ icon: Icon, label, value, trend, isPositive, color }) => (
    <div className="card stat-card-new">
        <div className="flex justify-between items-start mb-3">
            <div className={`icon-wrapper ${color}`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`trend ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{trend}%</span>
                </div>
            )}
        </div>
        <div className="stat-content">
            <h4 className="text-faint uppercase font-bold text-xs tracking-wider mb-1">{label}</h4>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-main">{value}</span>
                {trend && <span className="text-xs text-faint">vs last week</span>}
            </div>
        </div>
    </div>
);

const RecentPatient = ({ name, id, condition, time, status }) => (
    <div className="list-item flex justify-between items-center py-4 border-b border-light last:border-0 hover:bg-main/30 px-2 rounded-lg transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
            <div className="avatar-sm bg-primary-light text-primary font-bold">{name.charAt(0)}</div>
            <div>
                <h5 className="text-sm font-bold text-main">{name}</h5>
                <p className="text-xs text-faint">ID: {id}</p>
            </div>
        </div>
        <div className="hidden-sm">
            <span className="text-sm text-secondary font-medium">{condition}</span>
        </div>
        <div className="text-right">
            <span className={`badge ${status}`}>{status}</span>
            <p className="text-xs text-faint mt-1">{time}</p>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div className="dashboard-view animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-main tracking-tight">Overview</h1>
                    <p className="text-muted">Welcome back, Dr. Payal Patel. Here's your clinic today.</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    <span>New Consultation</span>
                </button>
            </div>

            {/* Top Stat Row */}
            <div className="stats-grid-new mb-8">
                <StatCard 
                    icon={Users} 
                    label="Total Patients" 
                    value="1,284" 
                    trend="12.5" 
                    isPositive={true} 
                    color="primary"
                />
                <StatCard 
                    icon={Calendar} 
                    label="Appointments" 
                    value="42" 
                    trend="4.2" 
                    isPositive={false} 
                    color="secondary"
                />
                <StatCard 
                    icon={Activity} 
                    label="Avg. Wait Time" 
                    value="18 min" 
                    trend="18" 
                    isPositive={true} 
                    color="success"
                />
                <StatCard 
                    icon={TrendingUp} 
                    label="Revenue" 
                    value="₹45,200" 
                    trend="8.1" 
                    isPositive={true} 
                    color="warning"
                />
            </div>

            {/* Calendar Section */}
            <div className="calendar-section mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-main tracking-tight">Appointment Schedule</h2>
                        <p className="text-faint font-medium">Manage and track your upcoming patient consultations.</p>
                    </div>
                </div>
                <AppointmentCalendar />
            </div>

            <div className="grid-layout mb-8">

                {/* Patient Flow Chart */}
                <div className="card chart-card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-extrabold text-main tracking-tight">Patient Flow</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs font-bold text-faint">
                                <span className="dot bg-primary"></span> Last 7 Days
                            </span>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: 'var(--text-faint)', fontSize: 12, fontWeight: 600}} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: 'var(--text-faint)', fontSize: 12, fontWeight: 600}} 
                                />
                                <Tooltip 
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: 'var(--shadow-lg)',
                                        background: 'var(--surface)'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="patients" 
                                    stroke="var(--primary)" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorPatients)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Patient Queue / Recent Visits */}
                <div className="card recent-visits">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-extrabold text-main tracking-tight">Recent Patient Visits</h3>
                        <button className="text-primary font-bold text-xs hover:underline uppercase tracking-widest">View All</button>
                    </div>
                    <div className="visits-list">
                        <RecentPatient 
                            name="Amit Sharma" 
                            id="P-10492" 
                            condition="Fever & Cough" 
                            time="10:30 AM" 
                            status="completed" 
                        />
                        <RecentPatient 
                            name="Priya Patel" 
                            id="P-09283" 
                            condition="Check-up" 
                            time="11:15 AM" 
                            status="waiting" 
                        />
                        <RecentPatient 
                            name="Rajesh Kumar" 
                            id="P-11201" 
                            condition="Knee Pain" 
                            time="11:45 AM" 
                            status="progress" 
                        />
                        <RecentPatient 
                            name="Sneha Rao" 
                            id="P-08572" 
                            condition="Allergy" 
                            time="12:30 PM" 
                            status="waiting" 
                        />
                        <RecentPatient 
                            name="Sneha Rao" 
                            id="P-08572" 
                            condition="Allergy" 
                            time="12:30 PM" 
                            status="waiting" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
