import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUsers, HiCube, HiBriefcase, HiLogout, HiCheckCircle } from 'react-icons/hi';

const AdminDashboardPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/admin/login');
    };

    const stats = [
        { label: "Total Users", value: "1,245", icon: <HiUsers />, color: "#3b82f6" },
        { label: "Active Products", value: "8,500", icon: <HiCube />, color: "#10b981" },
        { label: "Pending Approvals", value: "42", icon: <HiBriefcase />, color: "#f59e0b" },
        { label: "Completed Trades", value: "3.2M", icon: <HiCheckCircle />, color: "#8b5cf6" },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', color: '#1e293b' }}>
            {/* Admin Header */}
            <header style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1e3a8a' }}>IE Hub <span style={{ color: '#f59e0b' }}>Admin</span></div>
                <button onClick={handleLogout} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                    <HiLogout /> Logout
                </button>
            </header>

            <main className="container" style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>

                {/* Stat Grid */}
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((s, i) => (
                        <div key={i} className="card" style={{ padding: '1.5rem', background: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: `${s.color}20`, color: s.color, borderRadius: '8px', fontSize: '1.5rem' }}>{s.icon}</div>
                            <div>
                                <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>{s.label}</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{s.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Registrations (Mock) */}
                <div className="card" style={{ background: 'white', padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Use Management</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                <th style={{ padding: '1rem' }}>User</th>
                                <th style={{ padding: '1rem' }}>Role</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map((_, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem' }}>Member User {i + 1}</td>
                                    <td style={{ padding: '1rem' }}>Exporter</td>
                                    <td style={{ padding: '1rem' }}><span style={{ color: '#10b981', background: '#dcfce7', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>Active</span></td>
                                    <td style={{ padding: '1rem' }}><button style={{ color: '#3b82f6', background: 'transparent' }}>Edit</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;
