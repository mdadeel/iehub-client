import { useAuth } from '../hooks/useAuth';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { HiTrendingUp, HiUserGroup, HiArchive, HiCurrencyDollar } from 'react-icons/hi';

const DashboardPage = () => {
    const { user } = useAuth();

    const stats = [
        { title: "Total Imports", value: "24", icon: <HiArchive />, color: "#3b82f6" },
        { title: "Total Exports", value: "12", icon: <HiTrendingUp />, color: "#10b981" },
        { title: "Revenue", value: "$4,250", icon: <HiCurrencyDollar />, color: "#f59e0b" },
        { title: "Trade Rating", value: "4.9", icon: <HiUserGroup />, color: "#8b5cf6" },
    ];

    const chartData = [
        { name: 'Mon', imports: 4, exports: 2 },
        { name: 'Tue', imports: 3, exports: 5 },
        { name: 'Wed', imports: 2, exports: 3 },
        { name: 'Thu', imports: 5, exports: 7 },
        { name: 'Fri', imports: 8, exports: 4 },
    ];

    const pieData = [
        { name: 'Asia', value: 400 },
        { name: 'Europe', value: 300 },
        { name: 'USA', value: 200 },
        { name: 'Other', value: 100 },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '2rem' }}>Welcome, {user?.displayName || 'User'}</h1>

            {/* Stats Cards */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map((s, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: s.color, color: 'white', borderRadius: 'var(--radius-md)', fontSize: '1.5rem' }}>{s.icon}</div>
                        <div>
                            <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>{s.title}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card" style={{ padding: '1.5rem', height: '350px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Weekly Trade Activity</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="imports" fill="#3b82f6" />
                            <Bar dataKey="exports" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card" style={{ padding: '1.5rem', height: '350px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Market Distribution</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Recent Transactions</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '1rem 0.5rem' }}>Product</th>
                            <th style={{ padding: '1rem 0.5rem' }}>Type</th>
                            <th style={{ padding: '1rem 0.5rem' }}>Date</th>
                            <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                            <th style={{ padding: '1rem 0.5rem' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '1rem 0.5rem' }}>Ceylon Cinnamon</td>
                            <td style={{ padding: '1rem 0.5rem' }}><span style={{ color: '#10b981' }}>Export</span></td>
                            <td style={{ padding: '1rem 0.5rem' }}>Jan 04, 2026</td>
                            <td style={{ padding: '1rem 0.5rem' }}><span style={{ padding: '0.2rem 0.5rem', background: '#ecfdf5', color: '#059669', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>Completed</span></td>
                            <td style={{ padding: '1rem 0.5rem' }}>$450.00</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem 0.5rem' }}>Arabica Coffee</td>
                            <td style={{ padding: '1rem 0.5rem' }}><span style={{ color: '#3b82f6' }}>Import</span></td>
                            <td style={{ padding: '1rem 0.5rem' }}>Jan 03, 2026</td>
                            <td style={{ padding: '1rem 0.5rem' }}><span style={{ padding: '0.2rem 0.5rem', background: '#fef3c7', color: '#d97706', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>Pending</span></td>
                            <td style={{ padding: '1rem 0.5rem' }}>$162.50</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <style>{`
        .dark table { color: white; }
        .dark tr { border-color: #334155 !important; }
        .dark span[style*="background: #ecfdf5"] { background: #064e3b; color: #6ee7b7; }
        .dark span[style*="background: #fef3c7"] { background: #451a03; color: #fbbf24; }
      `}</style>
        </div>
    );
};

export default DashboardPage;
