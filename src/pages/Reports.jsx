import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';

const Reports = () => {
    const revenueData = [
        { name: 'Mon', amount: 4500 },
        { name: 'Tue', amount: 5200 },
        { name: 'Wed', amount: 4800 },
        { name: 'Thu', amount: 6100 },
        { name: 'Fri', amount: 5900 },
        { name: 'Sat', amount: 7200 },
        { name: 'Sun', amount: 3100 },
    ];

    const patientData = [
        { name: 'Week 1', count: 120 },
        { name: 'Week 2', count: 150 },
        { name: 'Week 3', count: 180 },
        { name: 'Week 4', count: 210 },
    ];

    const visitTypeData = [
        { name: 'New Patients', value: 45, color: '#4f46e5' },
        { name: 'Follow-ups', value: 35, color: '#0ea5e9' },
        { name: 'Walk-ins', value: 20, color: '#f59e0b' },
    ];

    const monthlyData = [
        { month: 'Sep', revenue: 85000, patients: 290 },
        { month: 'Oct', revenue: 92000, patients: 310 },
        { month: 'Nov', revenue: 88000, patients: 295 },
        { month: 'Dec', revenue: 105000, patients: 340 },
        { month: 'Jan', revenue: 115000, patients: 365 },
        { month: 'Feb', revenue: 128000, patients: 410 },
    ];

    const tooltipStyle = {
        contentStyle: {
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
            padding: '10px 14px',
            fontSize: '0.85rem'
        }
    };

    return (
        <div className="animate-fade-in">
            <PageHeader title="Analytics & Reports" subtitle="Visualizing your clinic's performance and growth">
                <select className="secondary-btn">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 6 Months</option>
                    <option>This Year</option>
                </select>
            </PageHeader>

            {/* Top Stats */}
            <div className="stats-grid">
                <StatCard icon={DollarSign} label="Annual Revenue" value="₹14.25L" variant="luxury" />
                <StatCard icon={Users} label="Unique Patients" value="1,280" />
                <StatCard icon={Calendar} label="Avg. Daily" value="24.5" />
                <StatCard icon={TrendingUp} label="Growth" value="+12.5%" />
            </div>

            {/* Charts Row 1 */}
            <div className="reports-grid">
                <div className="report-card glass">
                    <div className="card-header">
                        <h3>Revenue Trend</h3>
                        <span className="flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--emerald)' }}>
                            <ArrowUpRight size={16} /> +12.5%
                        </span>
                    </div>
                    <div className="chart-container" style={{ height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip {...tooltipStyle} />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#4f46e5"
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                    strokeWidth={2.5}
                                    dot={{ fill: '#4f46e5', r: 4, strokeWidth: 0 }}
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="report-card glass">
                    <div className="card-header">
                        <h3>Visit Types</h3>
                    </div>
                    <div className="chart-container" style={{ height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={visitTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={{ stroke: '#94a3b8' }}
                                >
                                    {visitTypeData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip {...tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="reports-grid mt-6">
                <div className="report-card glass">
                    <div className="card-header">
                        <h3>Monthly Revenue</h3>
                        <span className="flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--emerald)' }}>
                            <ArrowUpRight size={16} /> +11.3%
                        </span>
                    </div>
                    <div className="chart-container" style={{ height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip {...tooltipStyle} />
                                <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="report-card glass">
                    <div className="card-header">
                        <h3>Patient Growth</h3>
                    </div>
                    <div className="chart-container" style={{ height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={patientData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip {...tooltipStyle} />
                                <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid-cols-3 mt-6">
                <div className="glass p-4 rounded-2xl">
                    <p className="text-xs text-muted font-semibold mb-1">TOP REVENUE DAY</p>
                    <p className="font-extrabold text-lg">Saturday</p>
                    <p className="text-sm text-muted">Avg. ₹7,200/day</p>
                </div>
                <div className="glass p-4 rounded-2xl">
                    <p className="text-xs text-muted font-semibold mb-1">PEAK HOUR</p>
                    <p className="font-extrabold text-lg">10:00 – 11:00 AM</p>
                    <p className="text-sm text-muted">~8 patients/hour</p>
                </div>
                <div className="glass p-4 rounded-2xl">
                    <p className="text-xs text-muted font-semibold mb-1">AVG. BILL VALUE</p>
                    <p className="font-extrabold text-lg">₹520</p>
                    <p className="flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--emerald)' }}>
                        <ArrowUpRight size={14} /> +5.2% vs last month
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reports;
