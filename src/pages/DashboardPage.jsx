import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { HiArchive, HiTrendingUp, HiCurrencyDollar, HiUserGroup } from 'react-icons/hi';

const DashboardPage = () => {
    const { user } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            if (typeof user === 'undefined') {
                console.warn('User object is undefined in DashboardPage');
            }
        } catch (err) {
            setError(err.message);
        }
    }, [user]);

    if (error) {
        return (
            <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>System Sync Interrupted</h2>
                <p style={{ opacity: 0.6 }}>Unable to initialize dashboard protocols. Please re-authenticate.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary"
                    style={{ marginTop: '2rem' }}
                >
                    Retry Protocol Sync
                </button>
            </div>
        );
    }

    const stats = [
        { title: "Current Imports", value: "24", icon: <HiArchive />, color: "var(--primary)" },
        { title: "Active Exports", value: "12", icon: <HiTrendingUp />, color: "var(--secondary)" },
        { title: "Market Revenue", value: "$4,250", icon: <HiCurrencyDollar />, color: "#f59e0b" },
        { title: "Network Rating", value: "4.9", icon: <HiUserGroup />, color: "#8b5cf6" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}
        >
            <div className="flex justify-between items-end" style={{ marginBottom: '3rem' }}>
                <div>
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.25rem', letterSpacing: '-1px' }}
                    >
                        Sector <span style={{ color: 'var(--primary)' }}>Control</span>
                    </motion.h1>
                    <p style={{ opacity: 0.5, fontWeight: 600, fontSize: '0.9rem' }}>Operational status for {user?.displayName || 'Authorized User'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, opacity: 0.4, letterSpacing: '1px' }}>SYSTEM TIME</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{new Date().toLocaleTimeString()}</div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="card"
                        style={{
                            padding: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'var(--bg-glass)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)',
                            borderRadius: '24px'
                        }}
                    >
                        <div style={{
                            padding: '0.8rem',
                            background: `rgba(${s.color === 'var(--primary)' ? '37, 99, 235' : s.color === 'var(--secondary)' ? '16, 185, 129' : '245, 158, 11'}, 0.1)`,
                            color: s.color,
                            borderRadius: '16px',
                            fontSize: '1.5rem'
                        }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ opacity: 0.5, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.title}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{s.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Visualizers Grid */}
            <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem', marginBottom: '4rem' }}>
                <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="card"
                    style={{ padding: '1.5rem', minHeight: '350px', border: '1px solid var(--border-color)' }}
                >
                    <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Market Performance</h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', opacity: 0.6 }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div> Imports</div>
                            <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', opacity: 0.6 }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }}></div> Exports</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '220px', gap: '1.2rem' }}>
                        {[45, 65, 40, 85, 55, 95, 75].map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    style={{ background: 'var(--primary)', borderRadius: '8px 8px 0 0', position: 'relative' }}
                                >
                                    <div style={{ position: 'absolute', top: '-10px', left: '0', right: '0', height: '4px', background: 'rgba(255,255,255,0.2)', blur: '5px' }}></div>
                                </motion.div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h / 1.8}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 + 0.2 }}
                                    style={{ background: 'var(--secondary)', borderRadius: '4px 4px 0 0', opacity: 0.6 }}
                                ></motion.div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between" style={{ marginTop: '1.5rem', opacity: 0.4, fontSize: '0.75rem', fontWeight: 800 }}>
                        <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="card"
                    style={{ padding: '2.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}
                >
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem' }}>Portfolio Mix</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <div style={{
                            width: '240px', height: '240px', borderRadius: '50%',
                            background: 'conic-gradient(var(--primary) 0% 40%, var(--secondary) 40% 70%, #f59e0b 70% 90%, #8b5cf6 90% 100%)',
                            position: 'relative',
                            boxShadow: '0 0 40px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{
                                position: 'absolute', inset: '60px',
                                background: 'var(--bg-card)', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)'
                            }}>
                                100%
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Transactions Table Redesign */}
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="card"
                style={{ padding: '1.5rem', overflowX: 'auto', border: '1px solid var(--border-color)' }}
            >
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Network Activity</h3>
                    <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>View Global Ledger</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ opacity: 0.5 }}>
                            <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Asset Identifier</th>
                            <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Direction</th>
                            <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Global Date</th>
                            <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Validation</th>
                            <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Balance Adjustment</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="table-row">
                            <td style={{ padding: '1.2rem 1rem', fontWeight: 700 }}>Ceylon Cinnamon Premium</td>
                            <td style={{ padding: '1.2rem 1rem' }}><span style={{ color: 'var(--secondary)', fontWeight: 800 }}>EXPORT</span></td>
                            <td style={{ padding: '1.2rem 1rem', opacity: 0.6 }}>JAN 04, 2026</td>
                            <td style={{ padding: '1.2rem 1rem' }}><span className="badge-success">CONFIRMED</span></td>
                            <td style={{ padding: '1.2rem 1rem', fontWeight: 900 }}>+$450.00</td>
                        </tr>
                        <tr className="table-row">
                            <td style={{ padding: '1.2rem 1rem', fontWeight: 700 }}>Arabica Coffee Signature</td>
                            <td style={{ padding: '1.2rem 1rem' }}><span style={{ color: 'var(--primary)', fontWeight: 800 }}>IMPORT</span></td>
                            <td style={{ padding: '1.2rem 1rem', opacity: 0.6 }}>JAN 03, 2026</td>
                            <td style={{ padding: '1.2rem 1rem' }}><span className="badge-warning">VERIFYING</span></td>
                            <td style={{ padding: '1.2rem 1rem', fontWeight: 900 }}>-$162.50</td>
                        </tr>
                    </tbody>
                </table>
            </motion.div>

            <style>{`
                .table-row { transition: all 0.3s; background: rgba(0,0,0,0.02); }
                .table-row:hover { background: var(--bg-inset); transform: translateX(5px); }
                .dark .table-row { background: rgba(255,255,255,0.02); }
                
                .badge-success { 
                    padding: 0.4rem 0.8rem; background: rgba(16, 185, 129, 0.1); color: #10b981; 
                    border-radius: 8px; font-size: 0.75rem; font-weight: 800; border: 1px solid rgba(16, 185, 129, 0.2);
                }
                .badge-warning { 
                    padding: 0.4rem 0.8rem; background: rgba(245, 158, 11, 0.1); color: #f59e0b; 
                    border-radius: 8px; font-size: 0.75rem; font-weight: 800; border: 1px solid rgba(245, 158, 11, 0.2);
                }
            `}</style>
        </motion.div>
    );
};

export default DashboardPage;
