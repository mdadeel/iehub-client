import { motion } from 'framer-motion';

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
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-body)' }}>
            {/* Admin Header */}
            <header style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(12px)',
                padding: '1rem 3rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ fontWeight: '900', fontSize: '1.4rem', color: 'white', letterSpacing: '-0.5px' }}>
                    IE HUB <span style={{ color: 'var(--primary)' }}>SYSTEM CONTROL</span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="btn"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#f87171',
                        background: 'rgba(239, 68, 68, 0.1)',
                        padding: '0.6rem 1.2rem',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                    }}>
                    <HiLogout /> TERMINATE SESSION
                </motion.button>
            </header>

            <main className="container" style={{ padding: '3rem 2rem' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'white' }}
                    >
                        Global <span style={{ color: 'var(--primary)' }}>Overview</span>
                    </motion.h1>
                    <p style={{ opacity: 0.5, fontWeight: 600 }}>Real-time telemetry from across the trade network</p>
                </div>

                {/* Stat Grid */}
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="card"
                            style={{
                                padding: '2rem',
                                background: 'var(--bg-glass)',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                borderRadius: '20px'
                            }}
                        >
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: `${s.color}15`,
                                color: s.color,
                                borderRadius: '16px',
                                fontSize: '1.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 8px 16px -4px ${s.color}20`
                            }}>
                                {s.icon}
                            </div>
                            <div>
                                <div style={{ opacity: 0.4, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>{s.value}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* User Management */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card"
                    style={{
                        background: 'var(--bg-glass)',
                        padding: '3rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '24px'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>Infrastructure Management</h3>
                            <p style={{ opacity: 0.4, fontWeight: 600, fontSize: '0.9rem' }}>Comprehensive database of registered entities</p>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '0.7rem 1.4rem', fontWeight: 800 }}>EXPORT LOGS</button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1.5px' }}>
                                    <th style={{ padding: '1rem 1.5rem' }}>Entity / Identifier</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Sector Role</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Core Status</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Management</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <motion.tr
                                        key={i}
                                        whileHover={{ background: 'rgba(255,255,255,0.02)' }}
                                        style={{
                                            background: 'rgba(0,0,0,0.2)',
                                            borderRadius: '16px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <td style={{ padding: '1.25rem 1.5rem', borderRadius: '16px 0 0 16px', fontWeight: 700, color: 'white' }}>
                                            Global Logistics Corp_{400 + i}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', opacity: 0.6, fontWeight: 600 }}>EXPORTER_PREMIUM</td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{
                                                color: '#10b981',
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '8px',
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                letterSpacing: '0.5px'
                                            }}>SYNCHRONIZED</span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', borderRadius: '0 16px 16px 0' }}>
                                            <button style={{ color: 'var(--primary)', background: 'transparent', fontWeight: 800, fontSize: '0.85rem' }}>OVERRIDE</button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;
