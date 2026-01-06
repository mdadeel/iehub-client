import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { HiArchive, HiTrendingUp, HiCurrencyDollar, HiUserGroup, HiArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        exports: 0,
        imports: 0,
        value: 0,
        rating: 4.9 // Placeholder as we don't have a rating system yet
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Don't fetch personalized data for guest users
            if (!user?.email || user.isGuest) {
                setLoading(false);
                return;
            }

            try {
                const [productsRes, importsRes] = await Promise.all([
                    api.get(`/products`), // Fetch all to filter client-side if API doesn't support specific filter
                    api.get(`/imports/${user.email}`)
                ]);

                // Filter exports belonging to THIS user
                const myExports = productsRes.data.filter(p => p.exporterEmail === user.email);
                const myImports = importsRes.data;

                // Calculate Total Value (Price * Quantity for exports + Unit Price for imports)
                const exportValue = myExports.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
                const importValue = myImports.reduce((acc, curr) => acc + (curr.productId?.price || 0), 0);

                setStats({
                    exports: myExports.length,
                    imports: myImports.length,
                    value: exportValue,
                    rating: 4.9
                });
            } catch (error) {
                console.error("Dashboard sync failed", error);
                // Don't show toast on load to avoid spam, just log it. UI shows 0's.
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const statCards = user?.isGuest ? [
        { title: "Demo Exports", value: "12", icon: <HiTrendingUp />, color: "var(--secondary)" },
        { title: "Demo Imports", value: "8", icon: <HiArchive />, color: "var(--primary)" },
        { title: "Demo Asset Value", value: "$45,670", icon: <HiCurrencyDollar />, color: "#f59e0b" },
        { title: "Demo Rating", value: "4.8", icon: <HiUserGroup />, color: "#8b5cf6" },
    ] : [
        { title: "My Exports", value: stats.exports, icon: <HiTrendingUp />, color: "var(--secondary)" },
        { title: "Active Imports", value: stats.imports, icon: <HiArchive />, color: "var(--primary)" },
        { title: "Total Asset Value", value: `$${stats.value.toLocaleString()}`, icon: <HiCurrencyDollar />, color: "#f59e0b" },
        { title: "Trust Rating", value: stats.rating, icon: <HiUserGroup />, color: "#8b5cf6" },
    ];

    if (loading) return (
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: 'auto' }}></div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ paddingTop: '0.5rem', paddingBottom: '4rem' }}
        >
            <div className="flex justify-between items-end" style={{ marginBottom: '2rem' }}>
                <div>
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1.5px' }}
                    >
                        Overview
                    </motion.h1>
                    {user?.isGuest ? (
                        <div>
                            <p style={{ opacity: 0.6, fontWeight: 500 }}>
                                Welcome to the demo dashboard, <strong style={{ color: 'var(--text-heading)' }}>{user?.displayName}</strong>.
                            </p>
                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.8rem',
                                background: 'var(--bg-inset)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.85rem',
                                border: '1px solid var(--border-color)'
                            }}>
                                <p style={{ color: 'var(--secondary)', fontWeight: 600 }}>
                                    Note: You are using a demo account. Personalized data is not available in demo mode.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p style={{ opacity: 0.6, fontWeight: 500 }}>
                            Welcome back, <strong style={{ color: 'var(--text-heading)' }}>{user?.displayName}</strong>. Here is your sector summary.
                        </p>
                    )}
                </div>
                <div className="hidden md-block" style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.4, letterSpacing: '1px' }}>SYSTEM STATUS</div>
                    <div className="flex items-center gap-2" style={{ justifyContent: 'flex-end' }}>
                        <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>ONLINE</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {statCards.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="card"
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            background: 'var(--bg-glass)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)',
                            borderRadius: '20px'
                        }}
                    >
                        <div style={{
                            padding: '1rem',
                            background: `var(--bg-inset)`,
                            color: s.color,
                            borderRadius: '14px',
                            fontSize: '1.5rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ opacity: 0.5, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>{s.title}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{s.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Recent Activity / Chart Placeholder */}
                <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="card"
                    style={{ padding: '2rem', border: '1px solid var(--border-color)', minHeight: '300px', background: 'var(--bg-glass)' }}
                >
                    <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Trade Volume (7 Days)</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', fontWeight: 700 }}><span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '2px' }}></span> IMPORTS</div>
                            <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', fontWeight: 700 }}><span style={{ width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '2px' }}></span> EXPORTS</div>
                        </div>
                    </div>
                    {/* CSS-only Bar Chart */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '10%' }}>
                        {[60, 40, 75, 55, 90, 30, 80].map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                                <div style={{ height: `${h}%`, background: 'var(--primary)', borderRadius: '4px', opacity: 0.8 }}></div>
                                <div style={{ height: `${h * 0.6}%`, background: 'var(--secondary)', borderRadius: '4px', opacity: 0.8 }}></div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="card-gradient"
                    style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'white' }}>Quick Actions</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', fontSize: '0.9rem' }}>Manage your global trade portfolio.</p>

                    <div className="flex flex-col gap-3">
                        {user?.isGuest ? (
                            <>
                                <Link to="/products" className="btn" style={{ background: 'var(--bg-card)', color: 'var(--text-heading)', justifyContent: 'space-between' }}>
                                    <span>Browse Products</span>
                                    <HiArrowRight />
                                </Link>
                                <Link to="/register" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', justifyContent: 'space-between' }}>
                                    <span>Create Account</span>
                                    <HiArrowRight />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard/add-export" className="btn" style={{ background: 'var(--bg-card)', color: 'var(--text-heading)', justifyContent: 'space-between' }}>
                                    <span>New Export Listing</span>
                                    <HiArrowRight />
                                </Link>
                                <Link to="/products" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', justifyContent: 'space-between' }}>
                                    <span>Browse Marketplace</span>
                                    <HiArrowRight />
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>

            <style>{`
                .spinner {
                    width: 40px; height: 40px;
                    border: 3px solid var(--border-color); border-top-color: var(--primary);
                    border-radius: 50%; animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .card-gradient {
                    background: linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%);
                    border-radius: 24px;
                    color: white;
                }
                @media (max-width: 768px) {
                    .grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </motion.div>
    );
};

export default DashboardPage;
