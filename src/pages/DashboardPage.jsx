import { useAuth } from '../hooks/useAuth';
import { HiTrendingUp, HiUserGroup, HiArchive, HiCurrencyDollar } from 'react-icons/hi';

const DashboardPage = () => {
    const { user } = useAuth();

    const stats = [
        { title: "Total Imports", value: "24", icon: <HiArchive />, color: "#3b82f6" },
        { title: "Total Exports", value: "12", icon: <HiTrendingUp />, color: "#10b981" },
        { title: "Revenue", value: "$4,250", icon: <HiCurrencyDollar />, color: "#f59e0b" },
        { title: "Trade Rating", value: "4.9", icon: <HiUserGroup />, color: "#8b5cf6" },
    ];

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

            {/* Simplified Visualizers (Replaces Crashing Charts) */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card" style={{ padding: '1.5rem', height: '300px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Weekly Trade Activity</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '1rem' }}>
                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <div style={{ height: `${h}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                                <div style={{ height: `${h / 2}%`, background: 'var(--secondary)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', height: '300px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Market Distribution</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div style={{
                            width: '180px', height: '180px', borderRadius: '50%',
                            background: 'conic-gradient(var(--primary) 0% 40%, var(--secondary) 40% 70%, #f59e0b 70% 90%, #8b5cf6 90% 100%)',
                            position: 'relative'
                        }}>
                            <div style={{ position: 'absolute', inset: '40px', background: 'var(--bg-dark)', borderRadius: '50%' }}></div>
                        </div>
                    </div>
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
