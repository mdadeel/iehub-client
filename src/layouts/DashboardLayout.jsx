import { NavLink, Outlet } from 'react-router-dom';
import { HiHome, HiPlusCircle, HiArrowDown, HiArrowUp, HiUser, HiChartBar } from 'react-icons/hi';
import { useState, useEffect } from 'react';

const DashboardLayout = () => {
    const [error, setError] = useState(null);

    const menuItems = [
        { title: 'Overview', path: '/dashboard', icon: <HiChartBar /> },
        { title: 'Add Export', path: '/dashboard/add-export', icon: <HiPlusCircle /> },
        { title: 'My Exports', path: '/dashboard/my-exports', icon: <HiArrowUp /> },
        { title: 'My Imports', path: '/dashboard/my-imports', icon: <HiArrowDown /> },
        { title: 'Profile', path: '/dashboard/profile', icon: <HiUser /> },
    ];

    useEffect(() => {
        try {
            // Verify that menuItems are properly defined
            if (!menuItems || menuItems.length === 0) {
                console.error('Menu items are not properly defined');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error in DashboardLayout:', err);
        }
    }, []);

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
                <div>
                    <h2>Dashboard Layout Error</h2>
                    <p>There was an issue with the dashboard layout.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn"
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex" style={{ minHeight: 'calc(100vh - 80px)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: 'var(--bg-subtle-light)',
                padding: '2rem 1.5rem',
                borderRight: '1px solid var(--border-light)',
                zIndex: 10
            }}>
                <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                    <h5 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.5 }}>Management</h5>
                </div>
                <div className="flex flex-col gap-2">
                    {menuItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) => `btn ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                background: isActive ? 'var(--primary)' : 'transparent',
                                color: isActive ? 'white' : 'inherit',
                                justifyContent: 'flex-start',
                                padding: '0.8rem 1.2rem',
                                opacity: isActive ? 1 : 0.8,
                                gap: '1rem',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
                            })}
                        >
                            {({ isActive }) => (
                                <>
                                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                    <span style={{ fontSize: '0.95rem', fontWeight: isActive ? '600' : '500' }}>{item.title}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </aside>

            {/* Content Area */}
            <main style={{ flex: 1, padding: '3rem 4rem', background: 'var(--bg-subtle-light)', overflowY: 'auto' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <Outlet />
                </div>
            </main>

            <style>{`
                body.dark aside { background: var(--bg-subtle-dark); border-color: var(--border-dark); }
                body.dark main { background: var(--bg-dark); }

                @media (max-width: 1024px) {
                    aside { width: 240px; }
                    main { padding: 2rem; }
                }

                @media (max-width: 768px) {
                  aside { display: none; }
                }

                .btn:hover {
                    background: var(--border-light);
                    color: var(--primary);
                }
                .btn.active {
                    background: var(--primary);
                    color: white;
                }
                .dark .btn:hover {
                    background: var(--bg-subtle-dark);
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;
