import { NavLink, Outlet } from 'react-router-dom';
import { HiPlusCircle, HiArrowDown, HiArrowUp, HiUser, HiChartBar } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
    const { user } = useAuth();
    const [error, setError] = useState(null);

    const menuItems = user?.isGuest ? [
        { title: 'Overview', path: '/dashboard', icon: <HiChartBar /> },
        { title: 'Settings', path: '/dashboard/profile', icon: <HiUser /> },
    ] : [
        { title: 'Overview', path: '/dashboard', icon: <HiChartBar /> },
        { title: 'Add Export', path: '/dashboard/add-export', icon: <HiPlusCircle /> },
        { title: 'My Exports', path: '/dashboard/my-exports', icon: <HiArrowUp /> },
        { title: 'My Imports', path: '/dashboard/my-imports', icon: <HiArrowDown /> },
        { title: 'Settings', path: '/dashboard/profile', icon: <HiUser /> },
    ];

    useEffect(() => {
        if (!menuItems || menuItems.length === 0) {
            console.error('Menu items are not properly defined');
        }
    }, [menuItems]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-center p-4">
                <div>
                    <h2 className="text-2xl font-black mb-4">Dashboard System Error</h2>
                    <button onClick={() => window.location.reload()} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">
                        Refresh Interface
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100vh-80px)] bg-muted/20">
            {/* Sidebar */}
            <aside className="w-64 lg:w-72 bg-background border-r hidden md:flex flex-col p-6 sticky top-20 h-[calc(100vh-80px)]">
                <div className="mb-8">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 ml-2">Control Panel</div>
                    {user?.isGuest && (
                        <div className="bg-figma-orange/10 text-figma-orange text-[10px] font-black uppercase tracking-widest p-2 rounded-md border border-figma-orange/20 text-center">
                            Demo Sandbox Active
                        </div>
                    )}
                </div>

                <nav className="grid gap-1">
                    {menuItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                                isActive 
                                    ? "bg-figma-blue text-white shadow-lg shadow-figma-blue/20" 
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.title}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/50 border">
                        <div className="w-8 h-8 rounded-full bg-figma-blue/20 flex items-center justify-center text-figma-blue font-black text-xs">
                            {user?.displayName?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-xs font-bold truncate">{user?.displayName}</div>
                            <div className="text-[9px] text-muted-foreground truncate uppercase font-black tracking-widest">{user?.isGuest ? 'GUEST_ENTITY' : 'VERIFIED_TRADER'}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
